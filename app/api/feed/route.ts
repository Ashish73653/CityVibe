import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cityId = searchParams.get('cityId');
    const categoryId = searchParams.get('categoryId');
    const q = (searchParams.get('q') || '').trim();
    const mediaType = searchParams.get('mediaType');
    const minBudget = searchParams.get('minBudget');
    const maxBudget = searchParams.get('maxBudget');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!cityId) {
      return NextResponse.json(
        { error: 'cityId is required' },
        { status: 400 }
      );
    }

    const where: any = {
      cityId: parseInt(cityId),
      isHidden: false,
      AND: [],
    };

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (mediaType === 'IMAGE' || mediaType === 'VIDEO') {
      where.mediaType = mediaType;
    }

    const parsedMinBudget = minBudget ? parseInt(minBudget) : null;
    const parsedMaxBudget = maxBudget ? parseInt(maxBudget) : null;

    if (!isNaN(parsedMinBudget as number) || !isNaN(parsedMaxBudget as number)) {
      where.AND.push({
        budgetEstimate: {
          ...(parsedMinBudget !== null && !isNaN(parsedMinBudget) ? { gte: parsedMinBudget } : {}),
          ...(parsedMaxBudget !== null && !isNaN(parsedMaxBudget) ? { lte: parsedMaxBudget } : {}),
        },
      });
    }

    if (q) {
      where.AND.push({
        OR: [
          { caption: { contains: q } },
          { tags: { contains: q } },
          { place: { name: { contains: q } } },
          { place: { locality: { contains: q } } },
          { category: { name: { contains: q } } },
        ],
      });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    const posts = await prisma.recommendationPost.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        place: {
          select: {
            id: true,
            name: true,
            locality: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    const total = await prisma.recommendationPost.count({ where });

    return NextResponse.json({
      posts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Get feed error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

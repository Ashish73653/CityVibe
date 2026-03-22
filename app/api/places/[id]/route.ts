import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const placeId = parseInt(id);

    if (isNaN(placeId)) {
      return NextResponse.json({ error: 'Invalid place ID' }, { status: 400 });
    }

    const user = await getSession();

    const place = await prisma.place.findUnique({
      where: { id: placeId },
      include: {
        city: {
          select: {
            id: true,
            name: true,
            state: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        posts: {
          where: { isHidden: false },
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
        _count: {
          select: {
            posts: true,
            savedBy: true,
          },
        },
      },
    });

    if (!place) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    }

    // Check if user has saved this place
    let isSaved = false;
    if (user) {
      const savedPlace = await prisma.savedPlace.findUnique({
        where: {
          userId_placeId: {
            userId: user.id,
            placeId,
          },
        },
      });
      isSaved = !!savedPlace;
    }

    return NextResponse.json({
      place,
      isSaved,
    });
  } catch (error) {
    console.error('Get place error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

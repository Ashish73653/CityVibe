import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

const createPlaceSchema = z.object({
  name: z.string().min(2, 'Place name is required').max(120),
  categoryId: z.number().int().positive(),
  locality: z.string().max(120).optional(),
  address: z.string().max(240).optional(),
  description: z.string().max(600).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cityIdParam = searchParams.get('cityId');

    const where = cityIdParam
      ? { cityId: parseInt(cityIdParam, 10) }
      : undefined;

    if (cityIdParam && Number.isNaN(where?.cityId)) {
      return NextResponse.json({ error: 'Invalid cityId' }, { status: 400 });
    }

    const places = await prisma.place.findMany({
      where,
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        name: true,
        cityId: true,
        categoryId: true,
        locality: true,
        address: true,
        description: true,
      },
    });

    return NextResponse.json({ places });
  } catch (error) {
    console.error('Get places error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!user.selectedCityId) {
      return NextResponse.json({ error: 'Please select a city first' }, { status: 400 });
    }

    const body = await request.json();
    const parsed = createPlaceSchema.parse(body);

    const category = await prisma.category.findUnique({
      where: { id: parsed.categoryId },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const place = await prisma.place.create({
      data: {
        name: parsed.name.trim(),
        cityId: user.selectedCityId,
        categoryId: parsed.categoryId,
        locality: parsed.locality?.trim() || null,
        address: parsed.address?.trim() || null,
        description: parsed.description?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        cityId: true,
        categoryId: true,
      },
    });

    return NextResponse.json({ success: true, place }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Create place error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

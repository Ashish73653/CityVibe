import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { saveUploadedFile, isValidMediaFile, getMediaType } from '@/lib/upload';

const createPostSchema = z.object({
  placeId: z.number().int().positive(),
  caption: z.string().min(1, 'Caption is required'),
  tags: z.string().optional(),
  budgetEstimate: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!user.selectedCityId) {
      return NextResponse.json(
        { error: 'Please select a city first' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const placeId = parseInt(formData.get('placeId') as string);
    const caption = formData.get('caption') as string;
    const tags = formData.get('tags') as string | null;
    const budgetEstimate = formData.get('budgetEstimate')
      ? parseInt(formData.get('budgetEstimate') as string)
      : null;

    // Validate data
    const validatedData = createPostSchema.parse({
      placeId,
      caption,
      tags: tags || undefined,
      budgetEstimate: budgetEstimate || undefined,
    });

    // Validate file
    if (!file || !isValidMediaFile(file)) {
      return NextResponse.json(
        { error: 'Valid image or video file is required' },
        { status: 400 }
      );
    }

    // Get place to find category and city
    const place = await prisma.place.findUnique({
      where: { id: validatedData.placeId },
      select: { id: true, categoryId: true, cityId: true },
    });

    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }

    // Save file
    const mediaUrl = await saveUploadedFile(file);
    const mediaType = getMediaType(file);

    // Create post
    const post = await prisma.recommendationPost.create({
      data: {
        userId: user.id,
        cityId: place.cityId,
        placeId: place.id,
        categoryId: place.categoryId,
        caption: validatedData.caption,
        mediaUrl,
        mediaType,
        tags: validatedData.tags || null,
        budgetEstimate: validatedData.budgetEstimate || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        place: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

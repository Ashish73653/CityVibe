import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const placeId = parseInt(id);

    if (isNaN(placeId)) {
      return NextResponse.json({ error: 'Invalid place ID' }, { status: 400 });
    }

    // Check if place exists
    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    }

    // Check if already saved
    const existingSave = await prisma.savedPlace.findUnique({
      where: {
        userId_placeId: {
          userId: user.id,
          placeId,
        },
      },
    });

    if (existingSave) {
      // Unsave
      await prisma.savedPlace.delete({
        where: { id: existingSave.id },
      });

      return NextResponse.json({
        success: true,
        saved: false,
        message: 'Place removed from saved',
      });
    } else {
      // Save
      await prisma.savedPlace.create({
        data: {
          userId: user.id,
          placeId,
        },
      });

      return NextResponse.json({
        success: true,
        saved: true,
        message: 'Place saved successfully',
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Save/unsave place error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

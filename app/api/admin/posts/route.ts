import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireAdmin();

    const posts = await prisma.recommendationPost.findMany({
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
          },
        },
        city: {
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
        _count: {
          select: {
            likes: true,
            comments: true,
            reports: true,
          },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }

    console.error('Get admin posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

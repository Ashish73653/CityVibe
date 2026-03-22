import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    await prisma.recommendationPost.update({
      where: { id: postId },
      data: { isHidden: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Post hidden successfully',
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }

    console.error('Hide post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    const preorder = await prisma.preorder_enquiries.findUnique({
      where: { id },
      include: {
        preorder_files: true,
      },
    });

    if (!preorder) {
      return NextResponse.json({ error: 'Preorder not found' }, { status: 404 });
    }

    if (preorder.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(preorder);
  } catch (error) {
    console.error('GET /api/preorder/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch preorder' }, { status: 500 });
  }
}

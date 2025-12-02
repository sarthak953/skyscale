import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const preorders = await prisma.preorder_enquiries.findMany({
      where,
      include: {
        preorder_files: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(preorders);
  } catch (error) {
    console.error('Failed to fetch user preorders:', error);
    return NextResponse.json({ error: 'Failed to fetch preorders' }, { status: 500 });
  }
}

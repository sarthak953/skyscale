import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const preorders = await prisma.preorder_enquiries.findMany({
      include: {
        users: true,
        preorder_files: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json(preorders);
  } catch (error) {
    console.error('GET preorders error:', error);
    return NextResponse.json({ error: 'Failed to fetch preorders' }, { status: 500 });
  }
}
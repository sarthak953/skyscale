import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const preorder = await prisma.preorder_enquiries.findUnique({
      where: { id },
      include: {
        users: true,
        preorder_files: true
      }
    });

    if (!preorder) {
      return NextResponse.json({ error: 'Preorder not found' }, { status: 404 });
    }

    return NextResponse.json(preorder);
  } catch (error) {
    console.error('GET preorder error:', error);
    return NextResponse.json({ error: 'Failed to fetch preorder' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const preorder = await prisma.preorder_enquiries.update({
      where: { id },
      data: { 
        status,
        updated_at: new Date()
      },
      include: {
        users: true,
        preorder_files: true
      }
    });

    return NextResponse.json(preorder);
  } catch (error) {
    console.error('UPDATE preorder error:', error);
    return NextResponse.json({ error: 'Failed to update preorder' }, { status: 500 });
  }
}
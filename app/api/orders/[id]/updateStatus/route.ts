import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { tracking_status } from '@prisma/client';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { tracking_status: status } = await req.json();
    
    await prisma.order_tracking.create({
      data: {
        order_id: id,
        status: status as tracking_status,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

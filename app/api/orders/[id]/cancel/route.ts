import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.orders.findUnique({
      where: { id: params.id }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      return NextResponse.json({ error: 'Cannot cancel shipped/delivered order' }, { status: 400 });
    }

    await prisma.orders.update({
      where: { id: params.id },
      data: { status: 'cancelled' }
    });

    return NextResponse.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
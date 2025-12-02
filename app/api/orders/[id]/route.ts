import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/userService';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const order = await prisma.orders.findFirst({
      where: { 
        id: params.id,
        user_id: user.id
      },
      include: {
        order_items: true,
        order_tracking: {
          orderBy: {
            tracked_at: 'asc'
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
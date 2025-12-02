import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/userService';

export async function GET(req: Request) {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const orders = await prisma.orders.findMany({
      where: { user_id: user.id },
      include: {
        order_items: true,
        order_tracking: {
          orderBy: {
            tracked_at: 'desc'
          }
        },
        users: true
      },
      orderBy: {
        placed_at: 'desc'
      }
    });

    let filteredOrders = orders;
    if (status && status !== 'all') {
      filteredOrders = orders.filter(order => {
        const latestTracking = order.order_tracking[0];
        return latestTracking?.status === status;
      });
    }

    return NextResponse.json(filteredOrders);
  } catch (error) {
    console.error('GET orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
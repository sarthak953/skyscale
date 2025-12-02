import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('Fetching order with ID:', id);
    
    const order = await prisma.orders.findUnique({
      where: { 
        id
      },
      include: {
        order_items: {
          include: {
            products: true,
            product_variants: true
          }
        },
        order_tracking: true,
        users: true,
        coupons: true
      }
    });

    console.log('Found order:', order ? 'Yes' : 'No');
    if (order) {
      console.log('Order number:', order.order_number);
      console.log('Order items count:', order.order_items.length);
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Admin order fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
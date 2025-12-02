import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.orders.findMany({
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
      },
      orderBy: {
        placed_at: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('GET admin orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
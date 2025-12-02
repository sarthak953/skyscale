import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get counts
    const [totalProducts, totalOrders, totalUsers] = await Promise.all([
      prisma.products.count(),
      prisma.orders.count(),
      prisma.users.count()
    ]);

    // Get total revenue
    const revenueResult = await prisma.orders.aggregate({
      _sum: { total_cents: true }
    });
    const totalRevenue = revenueResult._sum.total_cents || 0;

    // Orders by status
    const ordersByStatus = await prisma.orders.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    // Top selling products
    const topProducts = await prisma.order_items.groupBy({
      by: ['product_name'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    });

    // Recent orders
    const recentOrders = await prisma.orders.findMany({
      take: 5,
      orderBy: { placed_at: 'desc' },
      include: { users: true }
    });

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await prisma.orders.groupBy({
      by: ['placed_at'],
      where: {
        placed_at: { gte: sixMonthsAgo }
      },
      _sum: { total_cents: true }
    });

    // Process monthly revenue data
    const revenueByMonth = monthlyRevenue.reduce((acc: any, order) => {
      const month = new Date(order.placed_at!).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + (order._sum.total_cents || 0);
      return acc;
    }, {});

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      ordersByStatus,
      topProducts,
      recentOrders,
      revenueByMonth,
      avgOrderValue
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
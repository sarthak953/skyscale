import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/userService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const reviews = await prisma.reviews.findMany({
      where: { product_id: productId },
      include: {
        users: {
          select: { first_name: true, last_name: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { productId, rating, title, comment } = await req.json();

    const hasPurchased = await prisma.order_items.findFirst({
      where: {
        product_id: productId,
        orders: {
          user_id: user.id,
          status: 'delivered'
        }
      }
    });

    const review = await prisma.reviews.create({
      data: {
        product_id: productId,
        user_id: user.id,
        rating,
        title,
        comment,
        is_verified_purchase: !!hasPurchased
      }
    });

    const allReviews = await prisma.reviews.findMany({
      where: { product_id: productId },
      select: { rating: true }
    });

    const avgRating = allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / allReviews.length;

    await prisma.products.update({
      where: { id: productId },
      data: {
        rating_avg: avgRating,
        review_count: allReviews.length
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

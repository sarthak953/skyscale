import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const products = await prisma.products.findMany({
      where: {
        AND: [
          { status: 'published' },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { short_description: { contains: query, mode: 'insensitive' } },
              { sku: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      include: {
        product_images: {
          where: { is_primary: true },
          take: 1
        }
      },
      take: 5
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ sku: string }> }) {
  try {
    const { sku } = await params;
    const product = await prisma.products.findUnique({
      where: { sku: sku },
      select: {
        id: true,
        name: true,
        sku: true,
        slug: true,
        short_description: true,
        full_description: true,
        scale: true,
        material: true,
        weight_grams: true,
        stock_quantity: true,
        product_images: {
          select: { image_url: true },
          orderBy: { sort_order: 'asc' },
        },
        product_specifications: {
          select: { spec_key: true, spec_value: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ product: null }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    return NextResponse.json({ image: '/images/1.jpg', product: null });
  }
}

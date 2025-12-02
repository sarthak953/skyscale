import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    console.log('Fetching product with slug:', slug);
    
    const product = await prisma.products.findFirst({
      where: { 
        slug: slug,
        status: 'published'
      },
      include: {
        categories: true,
        product_images: true,
        product_variants: true,
        product_specifications: true
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('GET /api/products/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
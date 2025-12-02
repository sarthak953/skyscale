import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const bestSellers = await prisma.products.findMany({
    where: {
      is_bestseller: true,
      status: 'published',
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price_cents: true,
      product_images: {
        where: { is_primary: true },
        select: { image_url: true },
        take: 1,
      },
    },
  });

  const formattedProducts = bestSellers.map((product) => {
    let imageUrl = product.product_images[0]?.image_url || '/images/products/placeholder.png';
    
    if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
      imageUrl = imageUrl.replace(/^.*\/public/, '');
      if (!imageUrl.startsWith('/')) imageUrl = '/' + imageUrl;
    }
    
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price_cents / 100,
      image: imageUrl,
    };
  });

  return NextResponse.json(formattedProducts);
}

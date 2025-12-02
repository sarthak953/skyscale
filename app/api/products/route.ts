import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '999999');
    const scale = searchParams.get('scale');
    const filterTypes = searchParams.get('filterTypes');

    const where: any = {
      status: 'published',
      stock_quantity: { gt: 0 },
      price_cents: {
        gte: minPrice,
        lte: maxPrice
      }
    };

    if (categoryId && categoryId !== '') {
      // Handle both UUID and slug filtering
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);
      if (isUUID) {
        where.category_id = categoryId;
      } else {
        // Find category by slug first
        const category = await prisma.categories.findFirst({ where: { slug: categoryId } });
        if (category) {
          where.category_id = category.id;
        }
      }
    }

    if (scale && scale !== '') {
      where.scale = scale;
    }

    if (filterTypes && filterTypes !== '') {
      const filterArray = filterTypes.split(',').map(f => f.trim());
      where.filter_type = { in: filterArray };
    }

    console.log('Products API where clause:', where);

    // Debug: Get all products first to see what's in the database
    const allProducts = await prisma.products.findMany({
      select: { id: true, name: true, category_id: true, status: true }
    });
    console.log('All products in DB:', allProducts);

    const products = await prisma.products.findMany({
      where,
      include: {
        categories: true,
        product_images: {
          where: { is_primary: true },
          take: 1
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    console.log(`Found ${products.length} products with filter`);
    // Debug: Log the actual products being returned
    console.log('Returning products:', products.map(p => ({ id: p.id, name: p.name, category_id: p.category_id })));
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
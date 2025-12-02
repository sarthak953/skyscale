import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    
    const products = await prisma.products.findMany({
      where: categoryId ? { category_id: categoryId } : {},
      include: { 
        categories: true,
        product_images: true,
        product_specifications: true,
        product_variants: true
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/admin/products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, imageUrl, variants, ...data } = await req.json();
    
    const product = await prisma.products.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      },
      include: { 
        categories: true,
        product_images: true,
        product_specifications: true,
        product_variants: true
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('PUT /api/admin/products error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.cart_items.updateMany({ where: { product_id: id }, data: { product_id: null } });
      await tx.order_items.updateMany({ where: { product_id: id }, data: { product_id: null } });
      await tx.products.delete({ where: { id } });
    });
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/admin/products error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { imageUrl, variants, ...data } = await req.json();
    
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const sku = `SKU-${Date.now()}`;

    const product = await prisma.products.create({
      data: {
        ...data,
        slug,
        sku,
        status: 'published',
      },
      include: { 
        categories: true,
        product_images: true,
        product_specifications: true,
        product_variants: true
      },
    });

    // Create product image if imageUrl is provided
    if (imageUrl) {
      await prisma.product_images.create({
        data: {
          product_id: product.id,
          image_url: imageUrl,
          is_primary: true,
          sort_order: 0
        }
      });
    }

    // Create variants if provided
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        if (variant.name) {
          await prisma.product_variants.create({
            data: {
              product_id: product.id,
              variant_name: variant.name,
              price_adjustment_cents: variant.price_adjustment * 100,
              stock_quantity: variant.stock,
              sku_suffix: variant.name.toLowerCase().replace(/\s+/g, '-')
            }
          });
        }
      }
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/products error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getOrCreateUser } from '@/lib/userService';

const getSessionId = async () => {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('cart_session_id')?.value;
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  return sessionId;
};

export async function GET() {
  try {
    const sessionId = await getSessionId();
    
    let cart = await prisma.carts.findFirst({
      where: { session_id: sessionId },
      include: {
        cart_items: {
          include: {
            products: {
              include: {
                product_images: {
                  where: { is_primary: true },
                  take: 1
                }
              }
            },
            product_variants: true
          }
        }
      }
    });

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const total = cart.cart_items.reduce((sum, item) => sum + (item.price_at_add_cents * item.quantity), 0);

    return NextResponse.json({ items: cart.cart_items, total });
  } catch (error) {
    console.error('GET /api/cart error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, variantId, qty } = body;
    const sessionId = await getSessionId();

    const product = await prisma.products.findUnique({
      where: { id: productId },
      include: { product_variants: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check stock availability
    const availableStock = product.stock_quantity || 0;
    if (availableStock < qty) {
      return NextResponse.json({ 
        error: 'Insufficient stock', 
        available: availableStock 
      }, { status: 400 });
    }

    let price = product.price_cents;
    if (variantId) {
      const variant = product.product_variants.find(v => v.id === variantId);
      if (variant) {
        price += variant.price_adjustment_cents || 0;
      }
    }

    let cart = await prisma.carts.findFirst({
      where: { session_id: sessionId }
    });

    if (!cart) {
      const user = await getOrCreateUser();
      cart = await prisma.carts.create({
        data: { 
          session_id: sessionId,
          user_id: user?.id || null
        }
      });
    }

    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
        variant_id: variantId || null
      }
    });

    const newQuantity = existingItem ? existingItem.quantity + qty : qty;
    if (availableStock < newQuantity) {
      return NextResponse.json({ 
        error: 'Insufficient stock', 
        available: availableStock 
      }, { status: 400 });
    }

    if (existingItem) {
      await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      await prisma.cart_items.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          variant_id: variantId || null,
          quantity: qty,
          price_at_add_cents: price
        }
      });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('cart_session_id', sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30
    });

    return response;
  } catch (error) {
    console.error('POST /api/cart error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    await prisma.cart_items.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/cart error:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}

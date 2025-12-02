import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getOrCreateUser } from '@/lib/userService';

export async function POST(req: Request) {
  try {
    const { address, paymentMethod } = await req.json();

    // Get session ID from cookies
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart_session_id')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'No cart session found' }, { status: 400 });
    }
    
    const cart = await prisma.carts.findFirst({
      where: { session_id: sessionId },
      include: {
        cart_items: {
          include: {
            products: true
          }
        }
      }
    });

    if (!cart || cart.cart_items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate totals
    const subtotal = cart.cart_items.reduce((sum, item) => sum + item.price_at_add_cents * item.quantity, 0);
    const shipping = 500; // ₹5 shipping
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Get or create user with Clerk ID
    const user = await getOrCreateUser();
    const email = address.email || 'guest@example.com';

    console.log('Creating order for user:', user?.id);

    // Save address if user is authenticated and saveAddress flag is true
    if (user && address.saveAddress) {
      const existingAddress = await prisma.user_addresses.findFirst({
        where: {
          user_id: user.id,
          street_line1: address.street_line1,
          city: address.city,
          postal_code: address.pincode
        }
      });

      if (!existingAddress) {
        await prisma.user_addresses.create({
          data: {
            user_id: user.id,
            recipient_name: address.name,
            street_line1: address.street_line1,
            street_line2: address.street_line2 || null,
            city: address.city,
            state: address.state,
            postal_code: address.pincode,
            country: address.country,
            is_default: false
          }
        });
      }
    }

    // Create order
    const order = await prisma.orders.create({
      data: {
        order_number: orderNumber,
        user_id: user?.id || null,
        guest_email: email,
        status: 'pending',
        subtotal_cents: subtotal,
        tax_cents: tax,
        shipping_cents: shipping,
        total_cents: total,
        shipping_address: address,
        payment_method: paymentMethod as any,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid'
      }
    });

    // Create order items and decrease stock
    for (const item of cart.cart_items) {
      await prisma.order_items.create({
        data: {
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.products?.name || 'Unknown Product',
          product_sku: item.products?.sku || 'N/A',
          quantity: item.quantity,
          unit_price_cents: item.price_at_add_cents,
          total_price_cents: item.price_at_add_cents * item.quantity
        }
      });

      // Decrease product stock
      if (item.product_id) {
        await prisma.products.update({
          where: { id: item.product_id },
          data: {
            stock_quantity: {
              decrement: item.quantity
            }
          }
        });
      }
    }

    // Clear cart
    await prisma.cart_items.deleteMany({
      where: { cart_id: cart.id }
    });

    return NextResponse.json({ 
      orderId: order.id, 
      orderNumber,
      order: {
        id: order.id,
        order_number: orderNumber,
        total_cents: total,
        subtotal_cents: subtotal,
        tax_cents: tax,
        shipping_cents: shipping
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
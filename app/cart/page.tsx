'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const [cartData, setCartData] = useState<any>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const getImageUrl = (url: string | undefined) => {
    if (!url) return '/images/1.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return url;
    if (url.includes('public/uploads/')) {
      return '/' + url.split('public/')[1];
    }
    return '/uploads/' + url.split('/').pop();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCartData(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await fetch(`/api/cart?itemId=${itemId}`, { method: 'DELETE' });
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading cart...</div>;
  }

  if (cartData.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <Link 
          href="/store" 
          className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {cartData.items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 p-6 border-b">
                <div className="w-24 h-24 relative bg-gray-100 rounded">
                  <Image
                    src={getImageUrl(item.products?.product_images?.[0]?.image_url)}
                    alt={item.products?.name || 'Product'}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.products?.name}</h3>
                  {item.product_variants && (
                    <p className="text-sm text-gray-600">Variant: {item.product_variants.variant_name}</p>
                  )}
                  <p className="text-gray-600 mt-1">
                    ₹{(item.price_at_add_cents / 100).toFixed(2)} × {item.quantity}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-lg">
                    ₹{((item.price_at_add_cents * item.quantity) / 100).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{(cartData.total / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{(cartData.total / 100).toFixed(2)}</span>
              </div>
            </div>

            <Link 
              href="/checkout"
              className="block w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition-colors font-semibold mb-3 text-center"
            >
              Proceed to Checkout
            </Link>
            
            <Link 
              href="/store" 
              className="block text-center text-sky-600 hover:text-sky-800 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

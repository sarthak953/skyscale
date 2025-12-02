'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  product: any;
}

export default function ProductCard({ product }: Props) {
  const [adding, setAdding] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [availableStock, setAvailableStock] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const getImageUrl = (url: string | undefined) => {
    if (!url) return '/images/1.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return url;
    if (url.includes('public/uploads/')) {
      return '/' + url.split('public/')[1];
    }
    return '/uploads/' + url.split('/').pop();
  };

  const addToCart = async () => {
    setAdding(true);
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, qty: 1 }),
    });
    const data = await res.json();
    if (!res.ok && data.error === 'Insufficient stock') {
      setAvailableStock(data.available);
      setShowStockModal(true);
    } else if (res.ok) {
      window.dispatchEvent(new Event('cartUpdated'));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    setAdding(false);
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed top-20 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-slide-in-right flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">Added to cart successfully!</span>
        </div>
      )}
      {showStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setShowStockModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">Limited Stock Available</h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              {availableStock === 0 
                ? '😔 This product is currently out of stock. Please check back later!' 
                : `We only have ${availableStock} unit(s) left in stock. Please adjust your quantity.`}
            </p>
            <button
              onClick={() => setShowStockModal(false)}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Understood
            </button>
          </div>
        </div>
      )}
      <div className="group bg-gradient-to-br from-white via-sky-50 to-sky-100 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-sky-100 hover:border-sky-300 h-full flex flex-col">
      {/* Product Image */}
      <div className="h-60 relative bg-white overflow-hidden flex-shrink-0 border-b border-sky-100">
        <Image
          src={getImageUrl(product.product_images?.[0]?.image_url)}
          alt={product.name}
          fill
          className="object-contain p-5 group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="px-6 py-5 flex flex-col flex-grow bg-white/60 backdrop-blur-sm">
        <div className="text-xs font-semibold text-sky-600 mb-2 uppercase tracking-wider">
          {product.categories?.name || 'Uncategorized'}
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm leading-tight hover:text-sky-700 transition-colors cursor-pointer min-h-[2.5rem] overflow-hidden">
            {product.name.length > 50 ? product.name.substring(0, 50) + '...' : product.name}
          </h3>
        </Link>

        {product.short_description && (
          <p className="text-gray-600 text-xs mb-3 leading-relaxed overflow-hidden min-h-[2rem]">
            {product.short_description.length > 60 ? product.short_description.substring(0, 60) + '...' : product.short_description}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-gray-200">
          <div className="text-lg font-bold text-gray-900 tracking-tight">
            ₹{(product.price_cents / 100).toFixed(2)}
          </div>
          {product.stock_quantity > 0 ? (
            <button
              onClick={addToCart}
              disabled={adding}
              className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-5 py-2.5 rounded-xl 
                hover:from-sky-600 hover:to-sky-700 transition-all duration-200 font-medium shadow-md 
                hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed 
                whitespace-nowrap text-sm"
            >
              {adding ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add to cart'
              )}
            </button>
          ) : (
            <span className="text-red-600 font-medium text-sm">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

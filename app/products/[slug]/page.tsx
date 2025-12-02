'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import ReviewSection from '@/components/store/ReviewSection';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
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
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      console.log('Fetching product with slug:', params.slug);
      const res = await fetch(`/api/products/${params.slug}`);
      const data = await res.json();
      console.log('Received product data:', data);
      setProduct(data);
      if (data.product_variants?.length > 0) {
        setSelectedVariant(data.product_variants[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [availableStock, setAvailableStock] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [stockMessage, setStockMessage] = useState('');

  const addToCart = async () => {
    setAddingToCart(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: product.id, 
          variantId: selectedVariant?.id,
          qty: quantity 
        })
      });
      const data = await res.json();
      if (!res.ok && data.error === 'Insufficient stock') {
        setAvailableStock(data.available);
        setStockMessage(data.available === 0 ? 'Out of stock!' : `Only ${data.available} left in stock`);
        setShowStockModal(true);
        setTimeout(() => setShowStockModal(false), 3000);
      } else if (res.ok) {
        window.dispatchEvent(new Event('cartUpdated'));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      alert('Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = async () => {
    setAddingToCart(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: product.id, 
          variantId: selectedVariant?.id,
          qty: quantity 
        })
      });
      const data = await res.json();
      if (!res.ok && data.error === 'Insufficient stock') {
        setAvailableStock(data.available);
        setStockMessage(data.available === 0 ? 'Out of stock!' : `Only ${data.available} left in stock`);
        setShowStockModal(true);
        setTimeout(() => setShowStockModal(false), 3000);
      } else if (res.ok) {
        window.location.href = '/checkout';
      }
    } catch (error) {
      alert('Error processing request');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  const currentPrice = selectedVariant 
    ? (product.price_cents + selectedVariant.price_adjustment_cents) / 100
    : product.price_cents / 100;

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
        <div className="fixed top-20 right-6 bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-slide-in-right flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-semibold">{stockMessage}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={getImageUrl(product.product_images?.[0]?.image_url)}
              alt={product.name}
              fill
              className="object-contain p-8"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="text-sm text-sky-600 font-medium mb-2">
              {product.categories?.name}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <div className="text-3xl font-bold text-gray-900 mb-6">
              ₹{currentPrice.toFixed(2)}
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-700">
            {product.full_description ? (
              <p className="whitespace-pre-line">{product.full_description}</p>
            ) : product.short_description ? (
              <p>{product.short_description}</p>
            ) : null}
          </div>

          {/* Variants */}
          {product.product_variants?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Variants</h3>
              <div className="flex flex-wrap gap-2">
                {product.product_variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedVariant?.id === variant.id
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {variant.variant_name}
                    {variant.price_adjustment_cents !== 0 && (
                      <span className="ml-2 text-sm">
                        ({variant.price_adjustment_cents > 0 ? '+' : ''}
                        ₹{(variant.price_adjustment_cents / 100).toFixed(2)})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.scale && (
                <div>
                  <span className="font-medium">Scale:</span> {product.scale}
                </div>
              )}
              {product.material && (
                <div>
                  <span className="font-medium">Material:</span> {product.material}
                </div>
              )}
              {product.weight_grams && (
                <div>
                  <span className="font-medium">Weight:</span> {product.weight_grams}g
                </div>
              )}
              <div>
                <span className="font-medium">Stock:</span> {
                  selectedVariant?.stock_quantity || product.stock_quantity
                }
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <label className="font-medium">Quantity:</label>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={addToCart}
              disabled={addingToCart}
              className="flex-1 bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors font-semibold disabled:opacity-50"
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={buyNow}
              disabled={addingToCart}
              className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <ReviewSection productId={product.id} />
      </div>
    </div>
    </>
  );
}
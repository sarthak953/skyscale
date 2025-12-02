'use client';

import { Order } from '@/types/order';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
}

interface ProductDetail {
  id: string;
  name: string;
  sku: string;
  slug?: string;
  short_description?: string;
  full_description?: string;
  scale?: string;
  material?: string;
  weight_grams?: number;
  stock_quantity?: number;
  product_images?: { image_url: string }[];
  product_specifications?: { spec_key: string; spec_value: string }[];
}

export default function OrderDetails({ order, onBack }: OrderDetailsProps) {
  const router = useRouter();
  const shippingAddress = order.shipping_address;
  const [productDetails, setProductDetails] = useState<Record<string, ProductDetail>>({});

  useEffect(() => {
    fetchProductDetails();
  }, [order]);

  const fetchProductDetails = async () => {
    const details: Record<string, ProductDetail> = {};
    for (const item of order.order_items || []) {
      try {
        const res = await fetch(`/api/products/image/${item.product_sku}`);
        if (res.ok) {
          const data = await res.json();
          if (data.product) {
            details[item.product_sku] = data.product;
          }
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      }
    }
    setProductDetails(details);
  };

  const getImageUrl = (url: string | undefined) => {
    if (!url) return '/images/1.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return url;
    if (url.includes('public/uploads/')) {
      const path = url.split('public/')[1];
      return path.startsWith('/') ? path : '/' + path;
    }
    if (url.includes('uploads/')) {
      const filename = url.split('/').pop();
      return '/uploads/' + filename;
    }
    return '/uploads/' + url;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </button>

      {/* Order Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.order_number}</h1>
            <p className="text-gray-500 text-sm">
              Placed on {new Date(order.placed_at).toLocaleDateString('en-IN')}
            </p>
          </div>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm ${
              order.status === 'delivered'
                ? 'bg-green-100 text-green-800'
                : order.status === 'shipped'
                ? 'bg-purple-100 text-purple-800'
                : order.status === 'processing'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        {/* Order & Shipping Info */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-3 text-gray-800">Order Items</h3>
            <div className="space-y-6">
              {order.order_items?.map((item) => {
                const product = productDetails[item.product_sku];
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                  >
                    <div className="grid md:grid-cols-2 gap-6 p-6">
                      {/* Product Image */}
                      <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={product?.product_images?.[0]?.image_url ? getImageUrl(product.product_images[0].image_url) : '/images/1.jpg'}
                          alt={item.product_name}
                          fill
                          className="object-contain p-8"
                          onError={(e) => {
                            e.currentTarget.src = '/images/1.jpg';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{item.product_name}</h4>
                          <p className="text-sm text-gray-500 mb-3">SKU: {item.product_sku}</p>
                          {product?.short_description && (
                            <p className="text-gray-700 text-sm mb-3">{product.short_description}</p>
                          )}
                        </div>

                        {/* Product Specs */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {product?.scale && (
                            <div>
                              <span className="font-medium text-gray-600">Scale:</span>
                              <p className="text-gray-900">{product.scale}</p>
                            </div>
                          )}
                          {product?.material && (
                            <div>
                              <span className="font-medium text-gray-600">Material:</span>
                              <p className="text-gray-900">{product.material}</p>
                            </div>
                          )}
                          {product?.weight_grams && (
                            <div>
                              <span className="font-medium text-gray-600">Weight:</span>
                              <p className="text-gray-900">{product.weight_grams}g</p>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-600">Quantity:</span>
                            <p className="text-gray-900">{item.quantity}</p>
                          </div>
                        </div>

                        {/* Additional Specifications */}
                        {product?.product_specifications && product.product_specifications.length > 0 && (
                          <div className="pt-3 border-t">
                            <h5 className="font-medium text-gray-700 mb-2 text-sm">Specifications</h5>
                            <div className="space-y-1 text-sm">
                              {product.product_specifications.map((spec, idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span className="text-gray-600">{spec.spec_key}:</span>
                                  <span className="text-gray-900">{spec.spec_value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Pricing */}
                        <div className="pt-3 border-t">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Unit Price:</span>
                            <span className="text-gray-900">₹{(item.unit_price_cents / 100).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg mb-3">
                            <span className="text-gray-900">Total:</span>
                            <span className="text-gray-900">₹{(item.total_price_cents / 100).toFixed(2)}</span>
                          </div>
                          <button
                            onClick={async () => {
                              if (product?.slug) {
                                router.push(`/products/${product.slug}`);
                              } else {
                                try {
                                  const res = await fetch(`/api/products/image/${item.product_sku}`);
                                  const data = await res.json();
                                  if (data.product?.slug) {
                                    router.push(`/products/${data.product.slug}`);
                                  } else {
                                    alert('Product page not available');
                                  }
                                } catch (err) {
                                  alert('Product page not available');
                                }
                              }
                            }}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                          >
                            Visit Product
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">Shipping Address</h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="font-medium text-gray-900">{shippingAddress?.name}</p>
              <p className="text-sm text-gray-700">{shippingAddress?.street_line1}</p>
              {shippingAddress?.street_line2 && <p className="text-sm text-gray-700">{shippingAddress.street_line2}</p>}
              <p className="text-sm text-gray-700">
                {shippingAddress?.city}, {shippingAddress?.state}{' '}
                {shippingAddress?.pincode}
              </p>
              <p className="text-sm text-gray-700">{shippingAddress?.country}</p>
              {shippingAddress?.phone && (
                <p className="text-sm text-gray-600 mt-1">
                  Phone: {shippingAddress.phone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Info */}
      {order.order_tracking && order.order_tracking.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold mb-4 text-gray-800">Tracking Information</h3>
          <div className="space-y-4">
            {order.order_tracking.map((tracking) => (
              <div
                key={tracking.id}
                className="flex items-start gap-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 capitalize">{tracking.status}</p>
                  {tracking.description && (
                    <p className="text-sm text-gray-600">{tracking.description}</p>
                  )}
                  {tracking.location && (
                    <p className="text-sm text-gray-600">
                      Location: {tracking.location}
                    </p>
                  )}
                  {tracking.carrier && (
                    <p className="text-sm text-gray-600">Carrier: {tracking.carrier}</p>
                  )}
                  {tracking.tracking_number && (
                    <p className="text-sm text-gray-600">
                      Tracking: {tracking.tracking_number}
                    </p>
                  )}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(tracking.tracked_at).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold mb-4 text-gray-800">Order Summary</h3>
        <div className="space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{(order.subtotal_cents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{(order.tax_cents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{(order.shipping_cents / 100).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span>₹{(order.total_cents / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-sm text-gray-600">
          <p>
            Payment Method:{' '}
            <span className="capitalize font-medium text-gray-900">
              {order.payment_method}
            </span>
          </p>
          <p>
            Payment Status:{' '}
            <span className="capitalize font-medium text-gray-900">
              {order.payment_status}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

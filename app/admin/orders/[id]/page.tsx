'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface OrderDetails {
  id: string;
  order_number: string;
  user_id: string;
  guest_email: string;
  status: string;
  subtotal_cents: number;
  tax_cents: number;
  shipping_cents: number;
  discount_cents: number;
  total_cents: number;
  payment_method: string;
  payment_status: string;
  payment_gateway_ref: string;
  placed_at: string;
  shipped_at: string;
  delivered_at: string;
  notes: string;
  shipping_address: any;
  billing_address: any;
  users: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  order_items: Array<{
    id: string;
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price_cents: number;
    total_price_cents: number;
    products: {
      name: string;
      slug: string;
    };
    product_variants: {
      variant_name: string;
    };
  }>;
  order_tracking: Array<{
    id: string;
    status: string;
    location: string;
    description: string;
    tracking_number: string;
    carrier: string;
    tracked_at: string;
  }>;
  coupons: {
    code: string;
    discount_type: string;
    discount_value: number;
  };
}

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    if (params.id) {
      fetchOrderDetails();
    }
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      console.log('Fetching order details for ID:', params.id);
      const response = await fetch(`/api/admin/orders/${params.id}`);
      const data = await response.json();
      console.log('Received order data:', data);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTracking = async () => {
    if (!trackingStatus) {
      setMessage({ type: 'error', text: 'Please select a tracking status' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/orders/${params.id}/updateStatus`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_status: trackingStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setMessage({ type: 'success', text: 'Tracking status updated successfully' });
      setTrackingStatus('');
      await fetchOrderDetails();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update tracking status' });
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTrackingStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'orderconfirmed': return '✓';
      case 'designinprogress': return '🎨';
      case 'inreview': return '👀';
      case 'designapproved': return '✅';
      case 'inproduction': return '🏭';
      case 'qualitycheck': return '🔍';
      case 'packaging': return '📦';
      case 'shipped': return '🚚';
      case 'delivered': return '🏠';
      case 'completed': return '🎉';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-slate-600 font-medium">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <Link 
            href="/admin/orders" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors duration-200 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
            Back to Orders
          </Link>
          
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Order #{order.order_number}</h1>
                <p className="text-slate-600">
                  Placed on {mounted ? new Date(order.placed_at).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : order.placed_at}
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <div className="text-2xl font-bold text-slate-900">
                  {formatCurrency(order.total_cents)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Order Items */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  🛍️ Order Items
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.order_items?.map((item, index) => (
                    <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 ${index !== order.order_items.length - 1 ? 'mb-4' : ''}`}>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg">{item.product_name}</h3>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                            SKU: {item.product_sku}
                          </span>
                          {item.product_variants?.variant_name && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {item.product_variants.variant_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold text-slate-900">×{item.quantity}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{formatCurrency(item.unit_price_cents)} each</p>
                        <p className="text-lg font-bold text-slate-900">{formatCurrency(item.total_price_cents)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Order Tracking */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  📍 Order Tracking
                </h2>
              </div>
              <div className="p-6">
                {/* Enhanced Add New Tracking Status */}
                <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    ➕ Add Tracking Status
                  </h3>
                  {message && (
                    <div className={`mb-4 p-4 rounded-xl shadow-sm border-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{message.type === 'success' ? '✅' : '❌'}</span>
                        {message.text}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <select
                      value={trackingStatus}
                      onChange={(e) => setTrackingStatus(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-slate-400 cursor-pointer font-medium"
                    >
                      <option value="">Select status...</option>
                      <option value="OrderConfirmed">✓ Order Confirmed</option>
                      <option value="DesignInProgress">🎨 Design In Progress</option>
                      <option value="InReview">👀 In Review</option>
                      <option value="DesignApproved">✅ Design Approved</option>
                      <option value="InProduction">🏭 In Production</option>
                      <option value="QualityCheck">🔍 Quality Check</option>
                      <option value="Packaging">📦 Packaging</option>
                      <option value="Shipped">🚚 Shipped</option>
                      <option value="Delivered">🏠 Delivered</option>
                      <option value="Completed">🎉 Completed</option>
                    </select>
                    <button
                      onClick={handleSaveTracking}
                      disabled={saving}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </span>
                      ) : (
                        'Save Status'
                      )}
                    </button>
                  </div>
                </div>

                {/* Enhanced Tracking History */}
                {order.order_tracking?.length > 0 && (
                  <div>
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                      📋 Tracking History
                    </h3>
                    <div className="space-y-4">
                      {order.order_tracking?.map((tracking, index) => (
                        <div key={tracking.id} className="relative">
                          {index !== order.order_tracking.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-blue-200"></div>
                          )}
                          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                              {getTrackingStatusIcon(tracking.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-slate-900 capitalize text-lg">{tracking.status.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1 rounded-full">
                                  {mounted ? new Date(tracking.tracked_at).toLocaleString() : tracking.tracked_at}
                                </span>
                              </div>
                              {tracking.location && (
                                <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                                  📍 <strong>Location:</strong> {tracking.location}
                                </p>
                              )}
                              {tracking.description && (
                                <p className="text-sm text-slate-600 mb-1">{tracking.description}</p>
                              )}
                              {tracking.tracking_number && (
                                <p className="text-sm text-slate-600 flex items-center gap-1">
                                  🚚 <strong>Tracking:</strong> {tracking.tracking_number} ({tracking.carrier})
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  💰 Order Summary
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal_cents)}</span>
                  </div>
                  {order.tax_cents > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600">Tax:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(order.tax_cents)}</span>
                    </div>
                  )}
                  {order.shipping_cents > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600">Shipping:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(order.shipping_cents)}</span>
                    </div>
                  )}
                  {order.discount_cents > 0 && (
                    <div className="flex justify-between items-center py-2 text-emerald-600">
                      <span>Discount:</span>
                      <span className="font-semibold">-{formatCurrency(order.discount_cents)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-slate-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">Total:</span>
                      <span className="text-2xl font-bold text-slate-900">{formatCurrency(order.total_cents)}</span>
                    </div>
                  </div>
                </div>
                
                {order.coupons && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🎟️</span>
                      <p className="font-bold text-emerald-800">Coupon Applied: {order.coupons.code}</p>
                    </div>
                    <p className="text-sm text-emerald-700">
                      {order.coupons.discount_type === 'percentage' ? `${order.coupons.discount_value}% off` : `$${order.coupons.discount_value} off`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  👤 Customer Information
                </h2>
              </div>
              <div className="p-6">
                {order.users ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">👤 Name:</span>
                      <span className="font-semibold text-slate-900">{order.users.first_name} {order.users.last_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">📧 Email:</span>
                      <span className="font-semibold text-slate-900">{order.users.email}</span>
                    </div>
                    {order.users.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">📱 Phone:</span>
                        <span className="font-semibold text-slate-900">{order.users.phone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">📧 Guest Email:</span>
                    <span className="font-semibold text-slate-900">{order.guest_email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Payment Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  💳 Payment Information
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">💳 Method:</span>
                  <span className="font-semibold text-slate-900 capitalize">{order.payment_method}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">📊 Status:</span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {order.payment_status.toUpperCase()}
                  </span>
                </div>
                {order.payment_gateway_ref && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">🔗 Reference:</span>
                    <span className="font-mono text-sm text-slate-900 bg-slate-100 px-2 py-1 rounded">{order.payment_gateway_ref}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Addresses */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  📍 Addresses
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    🚚 Shipping Address
                  </h3>
                  <div className="text-sm text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg">
                    <p className="font-semibold text-slate-900">{order.shipping_address.name}</p>
                    <p>{order.shipping_address.street}</p>
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>

                {order.billing_address && (
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      🧾 Billing Address
                    </h3>
                    <div className="text-sm text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg">
                      <p className="font-semibold text-slate-900">{order.billing_address.name}</p>
                      <p>{order.billing_address.street}</p>
                      <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.zipCode}</p>
                      <p>{order.billing_address.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Order Timeline */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  ⏰ Order Timeline
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">📅 Placed:</span>
                  <span className="font-semibold text-slate-900">
                    {mounted ? new Date(order.placed_at).toLocaleString() : order.placed_at}
                  </span>
                </div>
                {order.shipped_at && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">🚚 Shipped:</span>
                    <span className="font-semibold text-slate-900">
                      {mounted ? new Date(order.shipped_at).toLocaleString() : order.shipped_at}
                    </span>
                  </div>
                )}
                {order.delivered_at && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">🏠 Delivered:</span>
                    <span className="font-semibold text-slate-900">
                      {mounted ? new Date(order.delivered_at).toLocaleString() : order.delivered_at}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Notes */}
            {order.notes && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-4 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    📝 Notes
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg">{order.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
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
  placed_at: string;
  shipped_at: string;
  delivered_at: string;
  shipping_address: any;
  billing_address: any;
  users: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
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
  }>;
  order_tracking: Array<{
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

const TRACKING_STATUSES = [
  'OrderConfirmed',
  'DesignInProgress',
  'InReview',
  'DesignApproved',
  'InProduction',
  'QualityCheck',
  'Packaging',
  'Shipped',
  'Delivered',
  'Completed'
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<{[key: string]: string}>({});
  const [toast, setToast] = useState<{show: boolean; message: string}>({show: false, message: ''});

  useEffect(() => {
    setMounted(true);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data);
      const statusMap: {[key: string]: string} = {};
      data.forEach((order: Order) => {
        const latestTracking = order.order_tracking[order.order_tracking.length - 1];
        statusMap[order.id] = latestTracking?.status || 'OrderConfirmed';
      });
      setSelectedStatus(statusMap);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTrackingStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/updateStatus`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_status: selectedStatus[orderId] })
      });
      if (response.ok) {
        setToast({show: true, message: 'Status updated successfully'});
        setTimeout(() => setToast({show: false, message: ''}), 3000);
        setEditingOrder(null);
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getTrackingStatusColor = (status: string) => {
    const colors: {[key: string]: string} = {
      OrderConfirmed: 'bg-blue-100 text-blue-800',
      DesignInProgress: 'bg-purple-100 text-purple-800',
      InReview: 'bg-yellow-100 text-yellow-800',
      DesignApproved: 'bg-green-100 text-green-800',
      InProduction: 'bg-indigo-100 text-indigo-800',
      QualityCheck: 'bg-pink-100 text-pink-800',
      Packaging: 'bg-orange-100 text-orange-800',
      Shipped: 'bg-cyan-100 text-cyan-800',
      Delivered: 'bg-teal-100 text-teal-800',
      Completed: 'bg-emerald-100 text-emerald-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (loading) {
    return <div className="p-8 text-center">Loading orders...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Admin Panel
          </Link>
          <h1 className="text-3xl font-bold">Order Management</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">#{order.order_number}</div>
                      <div className="text-sm text-gray-500">{order.id.substring(0, 8)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      {order.users ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {order.users.first_name} {order.users.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{order.users.email}</div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">Guest: {order.guest_email}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium">{order.order_items.length} items</div>
                      <div className="text-gray-500">
                        {order.order_items.slice(0, 2).map((item, idx) => (
                          <div key={idx}>{item.quantity}x {item.product_name}</div>
                        ))}
                        {order.order_items.length > 2 && (
                          <div className="text-xs">+{order.order_items.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium">{formatCurrency(order.total_cents)}</div>
                      <div className="text-gray-500">
                        Sub: {formatCurrency(order.subtotal_cents)}
                        {order.tax_cents > 0 && <div>Tax: {formatCurrency(order.tax_cents)}</div>}
                        {order.shipping_cents > 0 && <div>Ship: {formatCurrency(order.shipping_cents)}</div>}
                        {order.discount_cents > 0 && <div>Disc: -{formatCurrency(order.discount_cents)}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {editingOrder === order.id ? (
                      <div className="flex flex-col gap-2">
                        <select
                          value={selectedStatus[order.id] || 'OrderConfirmed'}
                          onChange={(e) => setSelectedStatus({...selectedStatus, [order.id]: e.target.value})}
                          className="text-xs border rounded px-2 py-1"
                        >
                          {TRACKING_STATUSES.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateTrackingStatus(order.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingOrder(null)}
                            className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTrackingStatusColor(selectedStatus[order.id] || 'OrderConfirmed')}`}>
                          {selectedStatus[order.id] || 'OrderConfirmed'}
                        </span>
                        <button
                          onClick={() => setEditingOrder(order.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Update
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{order.payment_method}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {mounted ? new Date(order.placed_at).toLocaleDateString() : order.placed_at.split('T')[0]}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found
          </div>
        )}
      </div>
      
      {toast.show && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {toast.message}
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderConfirmationProps {
  orderData: {
    orderId: string;
    paymentMethod: string;
    address: any;
  };
}

export default function OrderConfirmation({ orderData }: OrderConfirmationProps) {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (orderData.orderDetails) {
      setOrderDetails(orderData.orderDetails);
    } else if (orderData.orderId) {
      fetchOrderDetails();
    }
  }, [orderData.orderId, orderData.orderDetails]);

  const fetchOrderDetails = async () => {
    try {
      console.log('Fetching order details for ID:', orderData.orderId);
      const response = await fetch(`/api/orders/${orderData.orderId}`);
      const data = await response.json();
      console.log('Order details response:', data);
      
      if (response.ok) {
        setOrderDetails(data);
      } else {
        console.error('API error:', data);
        // Set fallback data
        setOrderDetails({
          order_number: orderData.orderId,
          total_cents: 0,
          order_items: []
        });
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      // Set fallback data
      setOrderDetails({
        order_number: orderData.orderId,
        total_cents: 0,
        order_items: []
      });
    }
  };

  const handleCancelOrder = async () => {
    if (!orderData.orderId) return;
    
    setCancelling(true);
    try {
      const response = await fetch(`/api/orders/${orderData.orderId}/cancel`, {
        method: 'POST'
      });
      
      if (response.ok) {
        alert('Order cancelled successfully');
        window.location.href = '/orders';
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      alert('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (!orderDetails) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <div className="text-center py-8">Loading order details...</div>
      </div>
    );
  }

  // Fallback data if API fails
  const displayOrderId = orderDetails?.order_number || orderData.orderId || 'N/A';
  const displayTotal = orderDetails?.total_cents ? (orderDetails.total_cents / 100).toFixed(2) : '0.00';

  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-green-600 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600">Thank you for your purchase</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="text-sm text-gray-600 mb-1">Order ID</div>
        <div className="text-lg font-semibold">{displayOrderId}</div>
        <div className="text-sm text-gray-600 mb-1 mt-3">Total Amount</div>
        <div className="text-2xl font-bold text-green-600">₹{displayTotal}</div>
      </div>

      <div className="text-left space-y-4 mb-6">
        <div>
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2">
            {orderDetails.order_items?.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.product_name} x {item.quantity}</span>
                <span>₹{(item.total_price_cents / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{displayTotal}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <div className="text-sm text-gray-600">
            <div>{orderData.address.name}</div>
            <div>{orderData.address.street_line1}</div>
            {orderData.address.street_line2 && <div>{orderData.address.street_line2}</div>}
            <div>{orderData.address.city}, {orderData.address.state} {orderData.address.pincode}</div>
            <div>{orderData.address.phone}</div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Payment Method</h3>
          <div className="text-sm text-gray-600 capitalize">{orderData.paymentMethod}</div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleCancelOrder}
          disabled={cancelling}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {cancelling ? 'Cancelling...' : 'Cancel Order'}
        </button>
        <Link 
          href="/store"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
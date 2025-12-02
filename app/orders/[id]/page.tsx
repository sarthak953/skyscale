'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_cents: number;
  placed_at: string;
  order_items: Array<{
    product_name: string;
    quantity: number;
    unit_price_cents: number;
  }>;
  order_tracking: Array<{
    status: string;
    tracked_at: string;
  }>;
}

const TRACKING_STEPS = [
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

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchOrder();
    }
  }, [isLoaded, isSignedIn]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStep = () => {
    if (!order?.order_tracking?.length) return 0;
    const latestStatus = order.order_tracking[order.order_tracking.length - 1].status;
    return TRACKING_STEPS.indexOf(latestStatus);
  };

  if (!isLoaded || loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  if (!order) {
    return <div className="text-center py-8">Order not found</div>;
  }

  const currentStep = getCurrentStep();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.push('/orders')}
        className="text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Orders
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Order #{order.order_number}</h1>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Status:</span>
            <span className="ml-2 font-medium">{order.status}</span>
          </div>
          <div>
            <span className="text-gray-600">Total:</span>
            <span className="ml-2 font-medium">${(order.total_cents / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6">Order Tracking</h2>
        
        <div className="space-y-4">
          {TRACKING_STEPS.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={step} className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-white text-sm">{index + 1}</span>
                    )}
                  </div>
                  {index < TRACKING_STEPS.length - 1 && (
                    <div className={`w-0.5 h-12 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
                
                <div className="flex-1 pb-8">
                  <h3 className={`font-medium ${isCurrent ? 'text-green-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  {isCurrent && (
                    <p className="text-sm text-gray-600 mt-1">Current Status</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.order_items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.product_name}</span>
              <span className="font-medium">${(item.unit_price_cents / 100).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

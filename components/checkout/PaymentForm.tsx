'use client';

import { useState } from 'react';

interface PaymentFormProps {
  address: any;
  onNext: (paymentMethod: string, orderId: string, orderData?: any) => void;
  onBack: () => void;
}

export default function PaymentForm({ address, onNext, onBack }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          paymentMethod
        })
      });

      const data = await response.json();
      if (response.ok) {
        onNext(paymentMethod, data.orderId, data.order);
      } else {
        alert(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Credit/Debit Card</div>
              <div className="text-sm text-gray-500">Pay securely with your card</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">UPI/PayPal</div>
              <div className="text-sm text-gray-500">Pay with UPI or PayPal</div>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div>
              <div className="font-medium">Cash on Delivery</div>
              <div className="text-sm text-gray-500">Pay when you receive your order</div>
            </div>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Address
          </button>
          <button
            type="submit"
            disabled={!paymentMethod || loading}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
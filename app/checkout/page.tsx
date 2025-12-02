'use client';

import { useState } from 'react';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import AddressForm from '@/components/checkout/AddressForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderConfirmation from '@/components/checkout/OrderConfirmation';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<{
    address: any;
    paymentMethod: string | null;
    orderId: string | null;
    orderDetails: any;
  }>({
    address: null,
    paymentMethod: null,
    orderId: null,
    orderDetails: null
  });

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CheckoutSteps currentStep={currentStep} />
      
      <div className="mt-8 transition-all duration-300">
        <div className={`transition-opacity duration-300 ${currentStep === 1 ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <AddressForm 
            onNext={(address) => {
              setOrderData(prev => ({ ...prev, address }));
              nextStep();
            }}
          />
        </div>
        
        <div className={`transition-opacity duration-300 ${currentStep === 2 ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <PaymentForm 
            address={orderData.address}
            onNext={(paymentMethod, orderId, orderDetails) => {
              setOrderData(prev => ({ ...prev, paymentMethod, orderId, orderDetails }));
              nextStep();
            }}
            onBack={prevStep}
          />
        </div>
        
        <div className={`transition-opacity duration-300 ${currentStep === 3 ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {orderData.orderId && orderData.paymentMethod && (
            <OrderConfirmation 
              orderData={orderData as { orderId: string; paymentMethod: string; address: any; orderDetails: any; }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
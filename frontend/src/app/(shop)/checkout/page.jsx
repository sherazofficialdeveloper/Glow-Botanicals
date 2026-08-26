// app/(shop)/checkout/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PaymentMethods } from '@/components/checkout/PaymentMethods';
import { Container } from '@/components/common/Container';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { orderService } from '@/services/orderService';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [couponCode, setCouponCode] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=checkout');
    }
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [user, items, router]);

  const handleShippingSubmit = async (data) => {
    // Just capture the shipping/contact details and move to the payment
    // step. The order itself is created once a payment method is chosen,
    // since the backend requires paymentMethod at creation time.
    setOrderData(data);
    setStep(2);
  };

  const handleCreateOrder = async (paymentMethod) => {
    const order = await orderService.createOrder({
      ...orderData,
      paymentMethod,
      couponCode: couponCode || undefined,
    });
    setOrderId(order._id);
    return order;
  };

  const handlePaymentComplete = () => {
    clearCart();
    router.push(`/order-confirmation/${orderId}`);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumb className="mb-6" />

      <div className="flex items-center space-x-4 mb-8">
        <div className={`flex items-center space-x-2 ${step === 1 ? 'text-[#d9006c]' : 'text-gray-400'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 ? 'bg-[#d9006c] text-white' : 'bg-gray-200'}`}>
            1
          </span>
          <span className="font-bold">Shipping</span>
        </div>
        <div className="w-12 h-px bg-gray-200"></div>
        <div className={`flex items-center space-x-2 ${step === 2 ? 'text-[#d9006c]' : 'text-gray-400'}`}>
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-[#d9006c] text-white' : 'bg-gray-200'}`}>
            2
          </span>
          <span className="font-bold">Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <CheckoutForm
              onSubmit={handleShippingSubmit}
              loading={false}
            />
          )}

          {step === 2 && (
            <PaymentMethods
              orderId={orderId}
              total={total}
              onCreateOrder={handleCreateOrder}
              onPaymentComplete={handlePaymentComplete}
              onPaymentError={(error) => {
                showToast(error.message || 'Payment failed', 'error');
              }}
            />
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary showCoupon={step === 1} onCouponChange={setCouponCode} />
        </div>
      </div>
    </Container>
  );
}
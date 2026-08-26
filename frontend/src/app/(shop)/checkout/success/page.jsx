// app/(shop)/checkout/success/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { useCart } from '@/contexts/CartContext';
import { paymentService } from '@/services/paymentService';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('capturing'); // capturing | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const capture = async () => {
      const providerOrderId = searchParams.get('token');
      const pendingOrderId = sessionStorage.getItem('pendingOrderId');

      if (!providerOrderId || !pendingOrderId) {
        setStatus('error');
        setErrorMessage('Missing payment session details. If you completed a PayPal payment, check your orders page to confirm its status.');
        return;
      }

      try {
        await paymentService.capturePayPalOrder(pendingOrderId, providerOrderId);
        sessionStorage.removeItem('pendingOrderId');
        clearCart();
        setOrderId(pendingOrderId);
        setStatus('success');
      } catch (error) {
        setErrorMessage(error.response?.data?.message || error.message || 'Failed to confirm your PayPal payment.');
        setStatus('error');
      }
    };

    capture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'success' && orderId) {
      const timer = setTimeout(() => {
        router.push(`/order-confirmation/${orderId}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, orderId, router]);

  return (
    <Container className="py-16 sm:py-24">
      <div className="max-w-md mx-auto text-center">
        {status === 'capturing' && (
          <>
            <div className="w-16 h-16 rounded-full bg-rose-50 text-[#d9006c] flex items-center justify-center mx-auto mb-4">
              <Loader className="w-8 h-8 animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Confirming your payment...</h1>
            <p className="text-sm text-gray-600">Please wait while we finalize your PayPal payment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Payment successful!</h1>
            <p className="text-sm text-gray-600">Redirecting you to your order confirmation...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">We couldn't confirm your payment</h1>
            <p className="text-sm text-gray-600 mb-6">{errorMessage}</p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => router.push('/orders')}>View my orders</Button>
              <Button onClick={() => router.push('/checkout')} className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                Back to checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

// app/(shop)/checkout/cancel/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <Container className="py-16 sm:py-24">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Payment cancelled</h1>
        <p className="text-sm text-gray-600 mb-6">
          Your PayPal payment was cancelled and you have not been charged. Your order is still saved &mdash; you can try again or choose a different payment method.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => router.push('/checkout')}>Return to checkout</Button>
          <Button onClick={() => router.push('/orders')} className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            View my orders
          </Button>
        </div>
      </div>
    </Container>
  );
}

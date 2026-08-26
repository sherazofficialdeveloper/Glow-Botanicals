// components/checkout/PayPalPayment/PayPalPayment.jsx
'use client';

import { useState } from 'react';
import { Wallet, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useToast } from '@/hooks/useToast';
import { formatCurrency } from '@/utils/formatters';
import { paymentService } from '@/services/paymentService';

export const PayPalPayment = ({
  orderId,
  total,
  onError,
  className = '',
}) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayPalPayment = async () => {
    setIsLoading(true);

    try {
      // Create the PayPal order on the backend (server-side, using the
      // real order total — never trust a client-supplied amount).
      const { approvalUrl } = await paymentService.createPayPalOrder(orderId);

      if (!approvalUrl) {
        throw new Error('Failed to get PayPal approval link');
      }

      // Remember which internal order this PayPal session belongs to,
      // so /checkout/success can capture the right one after redirect.
      sessionStorage.setItem('pendingOrderId', orderId);

      // Hand off to PayPal's hosted checkout. It will redirect back to
      // FRONTEND_URL/checkout/success or /checkout/cancel (configured
      // server-side).
      window.location.href = approvalUrl;
    } catch (error) {
      showToast(error.message || 'Failed to start PayPal checkout', 'error');
      if (onError) onError(error);
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-blue-600" />
          <h4 className="text-sm font-bold text-gray-900">
            Pay with PayPal
          </h4>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          You will be redirected to PayPal to complete your payment securely.
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Amount</span>
          <span className="font-bold text-gray-900">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">PayPal Fee</span>
          <span className="text-gray-500">Included</span>
        </div>
      </div>

      <Button
        onClick={handlePayPalPayment}
        disabled={isLoading}
        className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Redirecting to PayPal...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span>Pay with PayPal</span>
          </>
        )}
      </Button>

      <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          You will be redirected to PayPal. If you don't have a PayPal account,
          you can pay with your credit or debit card as a guest.
        </p>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Secure payment processed by PayPal
      </p>
    </div>
  );
};

// components/checkout/StripePayment/StripePayment.jsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatCurrency } from '@/utils/formatters';
import { paymentService } from '@/services/paymentService';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const InnerCardForm = ({ orderId, total, onComplete, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Confirm the payment. redirect: 'if_required' keeps the customer
      // on this page unless their bank/wallet requires a redirect step
      // (e.g. 3D Secure, or a redirect-based method like Klarna).
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        if (onError) onError(error);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Backend re-queries Stripe directly to confirm and finalize the
        // order — never trust the client-side status alone.
        const { order } = await paymentService.captureStripePayment(orderId);
        onComplete({ method: 'stripe', order });
      } else {
        // Redirect-based method (3DS, Klarna, etc.) — Stripe will send
        // the customer to return_url, where /checkout/success or the
        // webhook will finalize things.
        setErrorMessage('Your payment is being processed. You will be redirected shortly.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Payment failed');
      if (onError) onError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {errorMessage && (
        <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full flex items-center justify-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>Pay {formatCurrency(total)}</span>
          </>
        )}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        Secure payment processed by Stripe
      </p>
    </form>
  );
};

export const StripePayment = ({
  orderId,
  total,
  onComplete,
  onError,
  className = '',
}) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const createIntent = async () => {
      try {
        const { clientSecret: secret } = await paymentService.createStripePaymentIntent(orderId);
        if (!cancelled) setClientSecret(secret);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.response?.data?.message || 'Failed to start card payment');
          if (onError) onError(error);
        }
      }
    };

    createIntent();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const options = useMemo(
    () => (clientSecret ? { clientSecret } : null),
    [clientSecret]
  );

  if (!stripePromise) {
    return (
      <div className={`p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-700 ${className}`}>
        Card payments are not configured yet. Please choose another payment method.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`flex items-start space-x-2 p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-red-700 ${className}`}>
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{loadError}</span>
      </div>
    );
  }

  if (!options) {
    return (
      <div className={`flex items-center justify-center py-6 ${className}`}>
        <Loader className="w-5 h-5 text-gray-400 animate-spin mr-2" />
        <span className="text-sm text-gray-500">Loading secure payment form...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <Elements stripe={stripePromise} options={options}>
        <InnerCardForm orderId={orderId} total={total} onComplete={onComplete} onError={onError} />
      </Elements>
    </div>
  );
};

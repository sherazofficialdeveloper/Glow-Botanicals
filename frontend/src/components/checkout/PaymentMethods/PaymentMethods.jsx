// components/checkout/PaymentMethods/PaymentMethods.jsx
'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  Truck, 
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PayPalPayment } from '../PayPalPayment';
import { StripePayment } from '../StripePayment';

export const PaymentMethods = ({
  orderId,
  total,
  onCreateOrder,
  onPaymentComplete,
  onPaymentError,
  className = '',
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(orderId);
  const [createError, setCreateError] = useState('');

  const paymentMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <Wallet className="w-5 h-5 text-blue-600" />,
      description: 'Pay securely with your PayPal account',
      available: true,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
      description: 'Pay when you receive your order',
      available: true,
    },
    {
      id: 'stripe',
      name: 'Credit / Debit Card',
      icon: <CreditCard className="w-5 h-5 text-[#d9006c]" />,
      description: 'Pay with Visa, Mastercard, Amex, Klarna, or Afterpay',
      available: true,
    },
  ];

  const handleSelectMethod = async (methodId) => {
    setSelectedMethod(methodId);
    setCreateError('');

    // Create the actual order now that a payment method has been chosen
    // (the backend requires paymentMethod at order-creation time).
    if (onCreateOrder && !activeOrderId) {
      setCreatingOrder(true);
      try {
        const order = await onCreateOrder(methodId);
        setActiveOrderId(order._id);
        setShowDetails(true);
      } catch (error) {
        setCreateError(error.message || 'Failed to create order. Please try again.');
        setSelectedMethod(null);
        if (onPaymentError) onPaymentError(error);
      } finally {
        setCreatingOrder(false);
      }
    } else {
      setShowDetails(true);
    }
  };

  const handlePaymentComplete = (data) => {
    if (onPaymentComplete) {
      onPaymentComplete(data);
    }
  };

  const handlePaymentError = (error) => {
    if (onPaymentError) {
      onPaymentError(error);
    }
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>

      {/* Payment Method List */}
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const isAvailable = method.available;

          return (
            <div
              key={method.id}
              className={`border rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#d9006c] bg-rose-50/50 ring-2 ring-[#d9006c]/20'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!isAvailable ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={() => isAvailable && handleSelectMethod(method.id)}
            >
              <div className="flex items-center p-4">
                <div className="flex-shrink-0 mr-3">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{method.name}</span>
                    {!isAvailable && (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    )}
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-[#d9006c]" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    isSelected
                      ? 'border-[#d9006c] bg-[#d9006c]'
                      : 'border-gray-300'
                  } flex items-center justify-center transition-all`}>
                    {isSelected && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              {isSelected && isAvailable && creatingOrder && (
                <div className="border-t border-gray-100 p-4 flex items-center justify-center text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-[#d9006c] border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating your order...
                </div>
              )}

              {isSelected && createError && (
                <div className="border-t border-gray-100 p-4">
                  <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{createError}</span>
                  </div>
                </div>
              )}

              {isSelected && isAvailable && showDetails && activeOrderId && (
                <div className="border-t border-gray-100 p-4">
                  {method.id === 'paypal' && (
                    <PayPalPayment
                      orderId={activeOrderId}
                      total={total}
                      onComplete={handlePaymentComplete}
                      onError={handlePaymentError}
                    />
                  )}
                  {method.id === 'stripe' && (
                    <StripePayment
                      orderId={activeOrderId}
                      total={total}
                      onComplete={handlePaymentComplete}
                      onError={handlePaymentError}
                    />
                  )}
                  {method.id === 'cod' && (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <Truck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Cash on Delivery
                          </p>
                          <p className="text-sm text-gray-600">
                            Pay when you receive your order. No advance payment required.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePaymentComplete({ method: 'cod' })}
                        className="w-full bg-[#d9006c] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#a80052] transition-colors"
                      >
                        Confirm COD Order
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Security Notice */}
      <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-400">
        <Sparkles className="w-3 h-3 text-[#d4af37]" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );
};
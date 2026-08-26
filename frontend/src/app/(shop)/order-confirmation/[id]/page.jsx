// app/(shop)/order-confirmation/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle, Package, Truck, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { orderService } from '@/services/orderService';
import { formatCurrency } from '@/utils/formatters';

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = params?.id;
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(id);
        setOrder(data);
      } catch (error) {
        showToast('Failed to load order', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchOrder();
    }
  }, [id, showToast]);

  if (loading) {
    return (
      <Container className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner text="Loading order confirmation..." />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="min-h-[400px] flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-gray-500 mt-2">We couldn't find your order.</p>
        <Link href="/" className="mt-4 text-[#d9006c] font-bold hover:underline">
          Go Home →
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      {/* Success Message */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Thank You for Your Order! 🎉
        </h1>
        <p className="text-gray-600 mt-2">
          Your order has been placed successfully.
        </p>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl inline-block">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="text-lg font-mono font-bold text-[#d9006c]">
            #{order.orderNumber}
          </p>
        </div>

        {/* Order Summary */}
        <div className="mt-6 text-left border-t border-gray-100 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium text-gray-700 uppercase">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Shipping</span>
            <span className="font-medium text-gray-700">
              {order.shippingAddress?.city}, {order.shippingAddress?.state}
            </span>
          </div>
        </div>

        {/* Email Notification */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start space-x-3 text-left">
          <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Order Confirmation Sent</p>
            <p className="text-xs text-gray-600">
              We've sent a confirmation email to your registered email address.
            </p>
          </div>
        </div>

        {/* Order Status */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-[#d9006c]/10 text-[#d9006c] flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-gray-700">Order Placed</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-gray-400">Processing</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2">
              <Truck className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-gray-400">Shipped</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/orders">
            <Button variant="outline" className="flex items-center space-x-2">
              <span>View Orders</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/products">
            <Button className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
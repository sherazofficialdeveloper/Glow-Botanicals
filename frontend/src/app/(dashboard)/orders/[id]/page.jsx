// app/(dashboard)/orders/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  MapPin,
  CreditCard,
  Download,
  Printer,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { orderService } from '@/services/orderService';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function OrderDetailPage({ params }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(id);
        setOrder(data);
      } catch (error) {
        showToast('Failed to load order', 'error');
        router.push('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, router, showToast]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pending', variant: 'warning', icon: Clock },
      processing: { label: 'Processing', variant: 'info', icon: Package },
      shipped: { label: 'Shipped', variant: 'primary', icon: Truck },
      delivered: { label: 'Delivered', variant: 'success', icon: CheckCircle },
      cancelled: { label: 'Cancelled', variant: 'danger', icon: XCircle },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pending', variant: 'warning' },
      paid: { label: 'Paid', variant: 'success' },
      failed: { label: 'Failed', variant: 'danger' },
      refunded: { label: 'Refunded', variant: 'secondary' },
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading order..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
        <Link href="/orders" className="inline-block mt-4 text-[#d9006c] font-bold hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const paymentConfig = getPaymentStatusConfig(order.paymentStatus);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Orders</span>
      </button>

      {/* Order Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <Badge variant={statusConfig.variant} size="md">
                <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                {statusConfig.label}
              </Badge>
              <Badge variant={paymentConfig.variant} size="md">
                <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                {paymentConfig.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                // Download invoice functionality
                showToast('Invoice download started', 'info');
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tracking Info */}
        {order.trackingNumber && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Tracking Number:
                </span>
                <span className="text-sm font-mono font-bold text-blue-700">
                  {order.trackingNumber}
                </span>
              </div>
              <a
                href={`https://tracking.example.com/${order.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#d9006c] font-bold hover:underline"
              >
                Track Order →
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            Shipping Address
          </h3>
          {order.shippingAddress ? (
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && (
                <p className="text-xs text-gray-400">
                  📞 {order.shippingAddress.phone}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No shipping address</p>
          )}
        </div>

        {/* Billing Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
            Billing Address
          </h3>
          {order.billingAddress ? (
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">
                {order.billingAddress.fullName}
              </p>
              <p>{order.billingAddress.address}</p>
              <p>
                {order.billingAddress.city}, {order.billingAddress.state}{' '}
                {order.billingAddress.zipCode}
              </p>
              <p>{order.billingAddress.country}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Same as shipping</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900 uppercase">
                {order.paymentMethod || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status</span>
              <Badge variant={paymentConfig.variant} size="sm">
                {paymentConfig.label}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Status</span>
              <Badge variant={statusConfig.variant} size="sm">
                {statusConfig.label}
              </Badge>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-gray-900 text-lg">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Order Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.product?.images?.[0] || '/images/placeholder.png'}
                        alt={item.product?.name}
                        className="w-12 h-12 object-contain rounded-lg bg-gray-50"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                        }}
                      />
                      <div>
                        <Link
                          href={`/products/${item.product?.slug}`}
                          className="font-medium text-gray-900 hover:text-[#d9006c] transition-colors"
                        >
                          {item.product?.name || 'Unknown Product'}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {item.product?.volume || ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-100">
              <tr>
                <td colSpan="3" className="px-6 py-3 text-right font-medium text-gray-600">
                  Subtotal
                </td>
                <td className="px-6 py-3 text-right font-bold text-gray-900">
                  {formatCurrency(order.subtotal)}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="px-6 py-3 text-right font-medium text-gray-600">
                  Shipping
                </td>
                <td className="px-6 py-3 text-right font-bold text-gray-900">
                  {formatCurrency(order.shipping || 0)}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="px-6 py-3 text-right font-medium text-gray-600">
                  Tax
                </td>
                <td className="px-6 py-3 text-right font-bold text-gray-900">
                  {formatCurrency(order.tax || 0)}
                </td>
              </tr>
              {order.discount > 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-3 text-right font-medium text-gray-600">
                    Discount
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-emerald-600">
                    -{formatCurrency(order.discount)}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="3" className="px-6 py-3 text-right font-bold text-gray-900">
                  Total
                </td>
                <td className="px-6 py-3 text-right font-bold text-[#d9006c] text-lg">
                  {formatCurrency(order.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-2">Order Notes</h3>
          <p className="text-sm text-gray-600">{order.notes}</p>
        </div>
      )}

      {/* Order Timeline */}
      {order.timeline && order.timeline.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Order Timeline</h3>
          <div className="space-y-4">
            {order.timeline.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-[#d9006c] mt-1.5"></div>
                  {index < order.timeline.length - 1 && (
                    <div className="absolute top-5 left-1.5 w-0.5 h-full bg-gray-200"></div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.status}</p>
                  <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                  {event.note && (
                    <p className="text-xs text-gray-600 mt-1">{event.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
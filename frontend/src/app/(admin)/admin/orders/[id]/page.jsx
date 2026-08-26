// app/(admin)/admin/orders/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { orderService } from '@/services/orderService';
import { formatCurrency, formatDate } from '@/utils/formatters';

export default function AdminOrderDetailPage({ params }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(id);
        setOrder(data);
      } catch (error) {
        showToast('Failed to load order', 'error');
        router.push('/admin/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, router, showToast]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await orderService.updateOrderStatus(id, newStatus);
      setOrder({ ...order, status: newStatus });
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (error) {
      showToast('Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

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
        <a href="/admin/orders" className="inline-block mt-4 text-[#d9006c] font-bold hover:underline">
          Back to Orders
        </a>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

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
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <Badge variant={statusConfig.variant} size="md">
                <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              disabled={updating}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent bg-white"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {updating && (
              <div className="w-4 h-4 border-2 border-[#d9006c] border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            Customer Information
          </h3>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-gray-900">
              {order.user?.name || 'Guest'}
            </p>
            <p className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-3.5 h-3.5" />
              <span>{order.user?.email || 'N/A'}</span>
            </p>
            {order.shippingAddress?.phone && (
              <p className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-3.5 h-3.5" />
                <span>{order.shippingAddress.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
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
            </div>
          ) : (
            <p className="text-sm text-gray-500">No shipping address</p>
          )}
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
            Payment Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Method</span>
              <span className="font-medium text-gray-900 uppercase">
                {order.paymentMethod || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <Badge
                variant={
                  order.paymentStatus === 'paid'
                    ? 'success'
                    : order.paymentStatus === 'failed'
                    ? 'danger'
                    : 'warning'
                }
                size="sm"
              >
                {order.paymentStatus || 'Pending'}
              </Badge>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-gray-900">
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.product?.name || 'Unknown Product'}
                        </p>
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
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-100">
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right font-medium text-gray-600">
                  Subtotal
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  {formatCurrency(order.subtotal)}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right font-medium text-gray-600">
                  Shipping
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  {formatCurrency(order.shipping || 0)}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right font-medium text-gray-600">
                  Tax
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  {formatCurrency(order.tax || 0)}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right font-bold text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 font-bold text-[#d9006c] text-lg">
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
    </div>
  );
}
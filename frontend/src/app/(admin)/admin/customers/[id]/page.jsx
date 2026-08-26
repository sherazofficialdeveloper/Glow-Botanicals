// app/(admin)/admin/customers/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Calendar, ShoppingBag, DollarSign, User } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { formatCurrency } from '@/utils/formatters';

export default function CustomerDetailPage({ params }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = params;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await adminService.getCustomer(id);
        setCustomer(data);
      } catch (error) {
        showToast('Failed to load customer', 'error');
        router.push('/admin/customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, router, showToast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading customer..." />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900">Customer not found</h2>
        <a href="/admin/customers" className="inline-block mt-4 text-[#d9006c] font-bold hover:underline">
          Back to Customers
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Customers</span>
      </button>

      {/* Customer Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#d9006c] to-[#d4af37] flex items-center justify-center text-white text-2xl font-bold">
              {customer.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <Badge variant={customer.isActive ? 'success' : 'danger'} size="md">
              {customer.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <span className="text-sm text-gray-400">
              Joined {new Date(customer.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{customer.orderCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(customer.totalSpent || 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
              <User className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Order</p>
              <p className="text-xl font-bold text-gray-900">
                {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-3">Contact Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{customer.phone || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-3">Addresses</h3>
          {customer.addresses?.length > 0 ? (
            <div className="space-y-3">
              {customer.addresses.map((address, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="font-medium text-gray-900">{address.fullName}</p>
                  <p className="text-gray-600">{address.address}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  {address.isDefault && (
                    <Badge variant="primary" size="sm" className="mt-1">
                      Default
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No addresses saved</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      {customer.recentOrders?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customer.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-[#d9006c]">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          order.status === 'delivered' ? 'success' :
                          order.status === 'cancelled' ? 'danger' :
                          order.status === 'shipped' ? 'primary' : 'warning'
                        }
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
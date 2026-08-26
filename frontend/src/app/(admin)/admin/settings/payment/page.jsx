// app/(admin)/admin/settings/payment/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CreditCard, Wallet, Truck } from 'lucide-react';

export default function PaymentSettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    // PayPal
    paypalEnabled: true,
    paypalClientId: '',
    paypalSecret: '',
    paypalMode: 'sandbox',

    // COD
    codEnabled: true,
    codInstructions: '',

    // General
    defaultPaymentMethod: 'paypal',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminService.getPaymentSettings();
        setFormData({
          paypalEnabled: data.paypalEnabled !== undefined ? data.paypalEnabled : true,
          paypalClientId: data.paypalClientId || '',
          paypalSecret: data.paypalSecret || '',
          paypalMode: data.paypalMode || 'sandbox',
          codEnabled: data.codEnabled !== undefined ? data.codEnabled : true,
          codInstructions: data.codInstructions || '',
          defaultPaymentMethod: data.defaultPaymentMethod || 'paypal',
        });
      } catch (error) {
        showToast('Failed to load payment settings', 'error');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSettings();
  }, [showToast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.updatePaymentSettings(formData);
      showToast('Payment settings updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update payment settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading payment settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
        <p className="text-sm text-gray-500">Configure payment methods</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Default Payment Method */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Default Payment Method</h3>
          <select
            name="defaultPaymentMethod"
            value={formData.defaultPaymentMethod}
            onChange={handleChange}
            className="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent bg-white"
          >
            <option value="paypal">PayPal</option>
            <option value="stripe">Credit / Debit Card</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        {/* PayPal Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">PayPal Settings</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="paypalEnabled"
                checked={formData.paypalEnabled}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d9006c]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:bg-[#d9006c] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">
                {formData.paypalEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          {formData.paypalEnabled && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client ID
                </label>
                <Input
                  name="paypalClientId"
                  value={formData.paypalClientId}
                  onChange={handleChange}
                  placeholder="Enter PayPal Client ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secret
                </label>
                <Input
                  name="paypalSecret"
                  type="password"
                  value={formData.paypalSecret}
                  onChange={handleChange}
                  placeholder="Enter PayPal Secret"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode
                </label>
                <select
                  name="paypalMode"
                  value={formData.paypalMode}
                  onChange={handleChange}
                  className="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent bg-white"
                >
                  <option value="sandbox">Sandbox (Test)</option>
                  <option value="live">Live (Production)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* COD Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-gray-900">Cash on Delivery</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="codEnabled"
                checked={formData.codEnabled}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d9006c]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:bg-[#d9006c] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">
                {formData.codEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          {formData.codEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                name="codInstructions"
                value={formData.codInstructions}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
                placeholder="Instructions for cash on delivery orders..."
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Payment Settings'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/settings')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
// app/(admin)/admin/settings/general/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function GeneralSettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    storeCity: '',
    storeState: '',
    storeZip: '',
    storeCountry: 'US',
    currency: 'USD',
    timezone: 'America/New_York',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminService.getSettings();
        setFormData({
          storeName: data.storeName || '',
          storeDescription: data.storeDescription || '',
          storeEmail: data.storeEmail || '',
          storePhone: data.storePhone || '',
          storeAddress: data.storeAddress || '',
          storeCity: data.storeCity || '',
          storeState: data.storeState || '',
          storeZip: data.storeZip || '',
          storeCountry: data.storeCountry || 'US',
          currency: data.currency || 'USD',
          timezone: data.timezone || 'America/New_York',
        });
      } catch (error) {
        showToast('Failed to load settings', 'error');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSettings();
  }, [showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }
    if (!formData.storeEmail.trim()) {
      newErrors.storeEmail = 'Store email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.storeEmail)) {
      newErrors.storeEmail = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await adminService.updateSettings(formData);
      showToast('Settings updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
        <p className="text-sm text-gray-500">Manage your store general settings</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name *
            </label>
            <Input
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="Glow  Botanical"
              error={errors.storeName}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Description
            </label>
            <textarea
              name="storeDescription"
              value={formData.storeDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
              placeholder="Luxury Skincare & Beauty"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Email *
            </label>
            <Input
              name="storeEmail"
              type="email"
              value={formData.storeEmail}
              onChange={handleChange}
              placeholder="hello@Glow botanical.com"
              error={errors.storeEmail}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Phone
            </label>
            <Input
              name="storePhone"
              value={formData.storePhone}
              onChange={handleChange}
              placeholder="+1 (800) 555-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Address
            </label>
            <Input
              name="storeAddress"
              value={formData.storeAddress}
              onChange={handleChange}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                name="storeCity"
                value={formData.storeCity}
                onChange={handleChange}
                placeholder="New York"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <Input
                name="storeState"
                value={formData.storeState}
                onChange={handleChange}
                placeholder="NY"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <Input
                name="storeZip"
                value={formData.storeZip}
                onChange={handleChange}
                placeholder="10001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                name="storeCountry"
                value={formData.storeCountry}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent bg-white"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="PK">Pakistan</option>
                <option value="IN">India</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent bg-white"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR (Rs)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent bg-white"
              >
                <option value="America/New_York">EST (UTC-5)</option>
                <option value="America/Chicago">CST (UTC-6)</option>
                <option value="America/Denver">MST (UTC-7)</option>
                <option value="America/Los_Angeles">PST (UTC-8)</option>
                <option value="Europe/London">GMT (UTC+0)</option>
                <option value="Asia/Karachi">PKT (UTC+5)</option>
                <option value="Asia/Kolkata">IST (UTC+5:30)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/settings')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
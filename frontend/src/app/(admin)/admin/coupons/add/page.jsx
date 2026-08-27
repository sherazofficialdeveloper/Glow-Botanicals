// app/(admin)/admin/coupons/add/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function AddCouponPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    description: '',
    minOrder: '',
    maxDiscount: '',
    usageLimit: '',
    expiryDate: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, code }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required';
    }
    if (!formData.discount || formData.discount <= 0) {
      newErrors.discount = 'Valid discount is required';
    }
    if (formData.discount > 100) {
      newErrors.discount = 'Discount cannot exceed 100%';
    }
    if (formData.expiryDate && new Date(formData.expiryDate) < new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await adminService.createCoupon({
        ...formData,
        discount: parseFloat(formData.discount),
        minOrder: formData.minOrder ? parseFloat(formData.minOrder) : 0,
        maxDiscount: formData.maxDiscount === '' ? undefined : parseFloat(formData.maxDiscount),
        usageLimit: formData.usageLimit === '' ? undefined : parseInt(formData.usageLimit),
      });
      showToast('Coupon created successfully!', 'success');
      router.push('/admin/coupons');
    } catch (error) {
      showToast(error.response?.data?.errors?.[0]?.message || error.response?.data?.message || error.message || 'Failed to create coupon', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Coupon</h1>
        <p className="text-sm text-gray-500">Create a new discount coupon</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code *
            </label>
            <div className="flex space-x-2">
              <Input
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., SUMMER20"
                error={errors.code}
                className="flex-1 uppercase"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateCode}
              >
                Generate
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%) *
            </label>
            <Input
              name="discount"
              type="number"
              min="1"
              max="100"
              value={formData.discount}
              onChange={handleChange}
              placeholder="20"
              error={errors.discount}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="20% off summer collection"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order
              </label>
              <Input
                name="minOrder"
                type="number"
                step="0.01"
                value={formData.minOrder}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Discount
              </label>
              <Input
                name="maxDiscount"
                type="number"
                step="0.01"
                value={formData.maxDiscount}
                onChange={handleChange}
                placeholder="10.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Limit
              </label>
              <Input
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleChange}
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <Input
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                error={errors.expiryDate}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d9006c]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:bg-[#d9006c] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">
                Active
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Coupon'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/coupons')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
// app/(admin)/admin/coupons/edit/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function EditCouponPage({ params }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
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

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const data = await adminService.getCoupon(id);
        setFormData({
          code: data.code || '',
          discount: data.discount || '',
          type: data.type || 'percentage',
          description: data.description || '',
          minOrder: data.minOrder || '',
          maxDiscount: data.maxDiscount || '',
          usageLimit: data.usageLimit || '',
          expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : '',
          isActive: data.isActive !== undefined ? data.isActive : true,
        });
      } catch (error) {
        showToast('Failed to load coupon', 'error');
        router.push('/admin/coupons');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchCoupon();
  }, [id, router, showToast]);

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
      await adminService.updateCoupon(id, {
        ...formData,
        discount: parseFloat(formData.discount),
        minOrder: formData.minOrder ? parseFloat(formData.minOrder) : 0,
        maxDiscount: formData.maxDiscount === '' ? undefined : parseFloat(formData.maxDiscount),
        usageLimit: formData.usageLimit === '' ? undefined : parseInt(formData.usageLimit),
      });
      showToast('Coupon updated successfully!', 'success');
      router.push('/admin/coupons');
    } catch (error) {
      showToast(error.response?.data?.errors?.[0]?.message || error.response?.data?.message || error.message || 'Failed to update coupon', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading coupon..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Coupon</h1>
        <p className="text-sm text-gray-500">Update coupon information</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code *
            </label>
            <Input
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., SUMMER20"
              error={errors.code}
              className="uppercase"
            />
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
              {loading ? 'Updating...' : 'Update Coupon'}
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
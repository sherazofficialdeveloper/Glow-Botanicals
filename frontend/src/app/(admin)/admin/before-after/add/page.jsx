// app/(admin)/admin/before-after/add/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function AddBeforeAfterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    beforeImage: '',
    afterImage: '',
    category: '',
    isActive: true,
    order: 0,
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

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.beforeImage.trim()) {
      newErrors.beforeImage = 'Before image URL is required';
    }
    if (!formData.afterImage.trim()) {
      newErrors.afterImage = 'After image URL is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await adminService.createBeforeAfter(formData);
      showToast('Before-after item created successfully!', 'success');
      router.push('/admin/before-after');
    } catch (error) {
      showToast(error.message || 'Failed to create item', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Before-After</h1>
        <p className="text-sm text-gray-500">Create a new before-after transformation item</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Skin Transformation"
              error={errors.title}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
              placeholder="Brief description of the transformation..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Before Image URL *
              </label>
              <Input
                name="beforeImage"
                value={formData.beforeImage}
                onChange={handleChange}
                placeholder="https://example.com/before.jpg"
                error={errors.beforeImage}
              />
              {formData.beforeImage && (
                <div className="mt-2 w-full h-24 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={formData.beforeImage}
                    alt="Before"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-before.jpg';
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                After Image URL *
              </label>
              <Input
                name="afterImage"
                value={formData.afterImage}
                onChange={handleChange}
                placeholder="https://example.com/after.jpg"
                error={errors.afterImage}
              />
              {formData.afterImage && (
                <div className="mt-2 w-full h-24 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={formData.afterImage}
                    alt="After"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-after.jpg';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Skincare, Haircare"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <Input
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              placeholder="0"
            />
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
              {loading ? 'Creating...' : 'Create Item'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/before-after')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
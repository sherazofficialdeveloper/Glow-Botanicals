// app/(admin)/admin/before-after/edit/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Upload } from 'lucide-react';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function EditBeforeAfterPage({ params }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
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
  const [uploading, setUploading] = useState({ beforeImage: false, afterImage: false });
  const isUploading = uploading.beforeImage || uploading.afterImage;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await adminService.getBeforeAfterItem(id);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          beforeImage: data.beforeImage || '',
          afterImage: data.afterImage || '',
          category: data.category || '',
          isActive: data.isActive !== undefined ? data.isActive : true,
          order: data.order || 0,
        });
      } catch (error) {
        showToast('Failed to load item', 'error');
        router.push('/admin/before-after');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchItem();
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
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.beforeImage.trim()) {
      newErrors.beforeImage = 'Before image URL or upload is required';
    }
    if (!formData.afterImage.trim()) {
      newErrors.afterImage = 'After image URL or upload is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (field, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, [field]: 'Please select an image file' }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({ ...prev, [field]: 'Image must be 5 MB or smaller' }));
      return;
    }

    const uploadData = new FormData();
    uploadData.append('images', file);
    setUploading((prev) => ({ ...prev, [field]: true }));

    try {
      const [uploaded] = await adminService.uploadBeforeAfterImages(uploadData);
      if (!uploaded?.url) throw new Error('The image upload did not return a URL');

      setFormData((prev) => ({ ...prev, [field]: uploaded.url }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
      showToast('Image uploaded successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Unable to upload image. Please try again.', 'error');
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await adminService.updateBeforeAfter(id, formData);
      showToast('Item updated successfully!', 'success');
      router.push('/admin/before-after');
    } catch (error) {
      showToast(error.message || 'Failed to update item', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading item..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Before-After</h1>
        <p className="text-sm text-gray-500">Update before-after transformation item</p>
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
                Before Image URL
              </label>
              <Input
                name="beforeImage"
                value={formData.beforeImage}
                onChange={handleChange}
                placeholder="https://example.com/before.jpg"
                error={errors.beforeImage}
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">OR</span>
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-600">
                  {uploading.beforeImage ? (
                    <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{uploading.beforeImage ? 'Uploading...' : 'Upload image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading.beforeImage}
                    onChange={(event) => {
                      handleImageUpload('beforeImage', event.target.files?.[0]);
                      event.target.value = '';
                    }}
                  />
                </label>
              </div>
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
                After Image URL
              </label>
              <Input
                name="afterImage"
                value={formData.afterImage}
                onChange={handleChange}
                placeholder="https://example.com/after.jpg"
                error={errors.afterImage}
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">OR</span>
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-600">
                  {uploading.afterImage ? (
                    <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{uploading.afterImage ? 'Uploading...' : 'Upload image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading.afterImage}
                    onChange={(event) => {
                      handleImageUpload('afterImage', event.target.files?.[0]);
                      event.target.value = '';
                    }}
                  />
                </label>
              </div>
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
              disabled={loading || isUploading}
            >
              {loading ? 'Updating...' : isUploading ? 'Uploading image...' : 'Update Item'}
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

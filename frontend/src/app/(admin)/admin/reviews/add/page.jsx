// app/(admin)/admin/reviews/add/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Star } from 'lucide-react';

export default function AddReviewPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    email: '',
    rating: 5,
    text: '',
    isApproved: true,
  });
  const [errors, setErrors] = useState({});

  // Real, database-driven product list — never hardcoded.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await adminService.getProducts({ limit: 200 });
        setProducts(data.items || []);
      } catch (error) {
        showToast('Failed to load products', 'error');
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [showToast]);

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
    if (!formData.productId) newErrors.productId = 'Please select a product';
    if (!formData.name.trim()) newErrors.name = 'Reviewer name is required';
    if (!formData.email.trim()) newErrors.email = 'Reviewer email is required';
    if (!formData.text.trim() || formData.text.trim().length < 5) {
      newErrors.text = 'Review must be at least 5 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await adminService.createReview({
        ...formData,
        rating: Number(formData.rating),
      });
      showToast('Review created successfully!', 'success');
      router.push('/admin/reviews');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create review', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Review</h1>
        <p className="text-sm text-gray-500">Manually create a review for a product</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product *
            </label>
            {productsLoading ? (
              <div className="py-2"><LoadingSpinner text="Loading products..." /></div>
            ) : (
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent bg-white"
              >
                <option value="">Select a product...</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>{product.name}</option>
                ))}
              </select>
            )}
            {errors.productId && (
              <p className="text-xs text-red-600 mt-1">{errors.productId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reviewer Name *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Sarah Johnson"
              error={errors.name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reviewer Email *
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sarah@example.com"
              error={errors.email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                  className="p-0.5"
                >
                  <Star
                    className={`w-6 h-6 ${star <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Text *
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
              placeholder="What did the customer say about this product?"
            />
            {errors.text && (
              <p className="text-xs text-red-600 mt-1">{errors.text}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isApproved"
              name="isApproved"
              checked={formData.isApproved}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-[#d9006c] focus:ring-[#d9006c]"
            />
            <label htmlFor="isApproved" className="text-sm text-gray-700">
              Publish immediately (approved)
            </label>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Review'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/reviews')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

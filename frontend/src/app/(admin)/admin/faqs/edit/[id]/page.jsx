// app/(admin)/admin/faqs/edit/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { adminService } from '@/services/adminService';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function EditFAQPage({ params }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'General',
    'Results',
    'Safety',
    'Ingredients',
    'Shipping',
    'Guarantee',
    'Usage',
    'Returns',
    'Payment',
  ];

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const data = await adminService.getFAQ(id);
        setFormData({
          question: data.question || '',
          answer: data.answer || '',
          category: data.category || 'General',
          order: data.order || 0,
        });
      } catch (error) {
        showToast('Failed to load FAQ', 'error');
        router.push('/admin/faqs');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchFAQ();
  }, [id, router, showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }
    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await adminService.updateFAQ(id, formData);
      showToast('FAQ updated successfully!', 'success');
      router.push('/admin/faqs');
    } catch (error) {
      showToast(error.message || 'Failed to update FAQ', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading FAQ..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit FAQ</h1>
        <p className="text-sm text-gray-500">Update frequently asked question</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question *
            </label>
            <Input
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="e.g., How fast can I expect to see results?"
              error={errors.question}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer *
            </label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
              placeholder="Detailed answer to the question..."
              error={errors.answer}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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

          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update FAQ'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/faqs')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
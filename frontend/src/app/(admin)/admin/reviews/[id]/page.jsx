// app/(admin)/admin/reviews/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, User, Mail, Calendar, Check, X, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { reviewService } from '@/services/reviewService';
import { formatDate } from '@/utils/formatters';

export default function AdminReviewDetailPage({ params }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = params;
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', rating: 5, text: '' });

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const data = await reviewService.getAdminReview(id);
        setReview(data);
        setFormData({ name: data.name || '', email: data.email || '', rating: data.rating || 5, text: data.text || '' });
      } catch (error) {
        showToast('Failed to load review', 'error');
        router.push('/admin/reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [id, router, showToast]);

  const handleApprove = async () => {
    setUpdating(true);
    try {
      await reviewService.approveReview(id);
      setReview({ ...review, isApproved: true, isRejected: false });
      showToast('Review approved successfully', 'success');
    } catch (error) {
      showToast('Failed to approve review', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    setUpdating(true);
    try {
      await reviewService.rejectReview(id);
      setReview({ ...review, isRejected: true, isApproved: false });
      showToast('Review rejected', 'info');
    } catch (error) {
      showToast('Failed to reject review', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setUpdating(true);
    try {
      const updated = await reviewService.updateReview(id, {
        ...formData,
        rating: Number(formData.rating),
      });
      setReview((current) => ({ ...current, ...updated }));
      showToast('Review updated successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update review', 'error');
    } finally {
      setUpdating(false);
    }
  };
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-[#d4af37] fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading review..." />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900">Review not found</h2>
        <Link href="/admin/reviews" className="inline-block mt-4 text-[#d9006c] font-bold hover:underline">
          Back to Reviews
        </Link>
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
        <span>Back to Reviews</span>
      </button>

      {/* Review Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">Review Details</h1>
              <Badge
                variant={
                  review.isApproved ? 'success' :
                  review.isRejected ? 'danger' : 'warning'
                }
                size="md"
              >
                {review.isApproved ? 'Approved' :
                 review.isRejected ? 'Rejected' : 'Pending'}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
          {!review.isApproved && !review.isRejected && (
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleApprove}
                disabled={updating}
                className="flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Approve</span>
              </Button>
              <Button
                onClick={handleReject}
                disabled={updating}
                variant="danger"
                className="flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Reject</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Review Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Review Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-3">Product</h3>
            <Link
              href={`/products/${review.product?.slug}`}
              className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              target="_blank"
            >
              <img
                src={review.product?.images?.[0] || '/images/placeholder.png'}
                alt={review.product?.name}
                className="w-16 h-16 object-contain rounded-lg bg-gray-50"
                onError={(e) => {
                  e.target.src = '/images/placeholder.png';
                }}
              />
              <div>
                <p className="font-bold text-gray-900">{review.product?.name}</p>
                <p className="text-sm text-gray-500">{review.product?.category}</p>
              </div>
            </Link>
          </div>

          <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Edit Review</h3>
            <input name="name" value={formData.name} onChange={handleEditChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" placeholder="Reviewer name" required />
            <input name="email" type="email" value={formData.email} onChange={handleEditChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" placeholder="Reviewer email" required />
            <select name="rating" value={formData.rating} onChange={handleEditChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white">
              {[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} star{rating > 1 ? 's' : ''}</option>)}
            </select>
            <textarea name="text" value={formData.text} onChange={handleEditChange} rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" placeholder="Review text" required minLength={5} />
            <Button type="submit" disabled={updating}>{updating ? 'Saving...' : 'Save Changes'}</Button>
          </form>
          {/* Review Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  {renderStars(review.rating)}
                  <span className="font-bold text-gray-900">{review.rating}.0</span>
                </div>
                {review.title && (
                  <h3 className="font-bold text-gray-900 text-lg mt-2">{review.title}</h3>
                )}
                <p className="text-gray-700 mt-3 leading-relaxed">{review.text}</p>
              </div>
            </div>

            {review.images && review.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Attached Images</p>
                <div className="flex space-x-3">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review image ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - User Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-3">Customer</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#d9006c] to-[#d4af37] flex items-center justify-center text-white font-bold text-lg">
                {review.user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-bold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{review.user?.email || 'N/A'}</span>
                </div>
              </div>
            </div>
            {review.isVerified && (
              <div className="mt-3 flex items-center space-x-1 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                <Check className="w-4 h-4" />
                <span>Verified Purchase</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-3">Review Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <Badge
                  variant={
                    review.isApproved ? 'success' :
                    review.isRejected ? 'danger' : 'warning'
                  }
                  size="sm"
                >
                  {review.isApproved ? 'Approved' :
                   review.isRejected ? 'Rejected' : 'Pending'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Submitted</span>
                <span className="text-gray-700">{formatDate(review.createdAt)}</span>
              </div>
              {review.isApproved && review.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Approved</span>
                  <span className="text-gray-700">{formatDate(review.approvedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// app/(dashboard)/reviews/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Pencil, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { reviewService } from '@/services/reviewService';
import { formatDate } from '@/utils/formatters';

export default function ReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getMyReviews({ page, limit: 10 });
      setReviews(data.items || []);
    } catch (error) {
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewService.deleteMyReview(id);
      showToast('Review deleted successfully', 'success');
      fetchReviews();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Failed to delete review',
        'error'
      );
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-[#d4af37] fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Loading reviews..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-sm text-gray-500">
          {reviews.length} reviews written
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Reviews Yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            You haven't written any reviews yet
          </p>
          <Link href="/products" className="inline-block mt-4">
            <Button>Shop Now & Review</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/products/${review.product?.slug}`}
                      className="font-bold text-gray-900 hover:text-[#d9006c] transition-colors"
                    >
                      {review.product?.name || 'Product'}
                    </Link>
                    {review.isApproved ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                      </Badge>
                    ) : review.isRejected ? (
                      <Badge variant="danger" size="sm">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Approval
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-xs text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{review.text}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2 mt-3">
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Review ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  )}
                  {!review.isApproved && !review.isRejected && (
                    <p className="text-xs text-gray-400 mt-3">
                      Your review is pending admin approval. You'll be notified once it's approved.
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/products/${review.product?.slug}`}
                    className="p-1.5 text-gray-400 hover:text-[#d9006c] rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
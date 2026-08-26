// components/product/ProductReviews/ProductReviews.jsx
'use client';

import { useState } from 'react';
import { Star, User, ThumbsUp, ThumbsDown, Flag, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Button } from '@/components/common/Button';
import { RatingStars } from '@/components/common/RatingStars';
import { useAuth } from '@/hooks/useAuth';

export const ProductReviews = ({
  reviews = [],
  loading = false,
  productId,
  onAddReview,
  onVoteHelpful,
  averageRating = 0,
  totalReviews = 0,
  className = '',
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const ratingDistribution = {
    5: reviews?.filter(r => r.rating === 5).length || 0,
    4: reviews?.filter(r => r.rating === 4).length || 0,
    3: reviews?.filter(r => r.rating === 3).length || 0,
    2: reviews?.filter(r => r.rating === 2).length || 0,
    1: reviews?.filter(r => r.rating === 1).length || 0,
  };

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews?.filter(r => r.rating === parseInt(filter));

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
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="mt-3 h-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Customer Reviews</h3>
          <div className="flex items-center space-x-3 mt-1">
            <div className="flex items-center space-x-1">
              <RatingStars rating={averageRating} />
              <span className="text-sm font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({totalReviews} reviews)
            </span>
          </div>
        </div>

        {isAuthenticated && (
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            variant={showReviewForm ? 'secondary' : 'primary'}
            size="sm"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          onSubmit={onAddReview}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Rating Distribution */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center space-x-2 mb-1.5">
                <span className="text-xs font-medium text-gray-600 w-6">{star}</span>
                <Star className="w-3 h-3 text-[#d4af37] fill-current" />
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#d4af37] rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
            filter === 'all'
              ? 'bg-[#d9006c] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({reviews?.length || 0})
        </button>
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            onClick={() => setFilter(star.toString())}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors flex items-center space-x-1 ${
              filter === star.toString()
                ? 'bg-[#d9006c] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{star}</span>
            <Star className="w-3 h-3 fill-current" />
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {filteredReviews?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-1">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d9006c] to-[#d4af37] flex items-center justify-center text-white font-bold text-sm">
                    {review.user?.name?.charAt(0) || review.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">
                      {review.user?.name || review.name || 'Anonymous'}
                    </p>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-xs text-gray-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                {review.isVerified && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
              
              {review.title && (
                <h4 className="font-bold text-sm text-gray-900 mt-3">{review.title}</h4>
              )}
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{review.comment}</p>
              
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

              {/* Helpful Actions */}
              <div className="flex items-center space-x-4 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => onVoteHelpful?.(review._id)}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-[#d9006c] transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({review.helpful || 0})</span>
                </button>
                <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ productId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      alert('Please write a review');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        productId,
        rating,
        title,
        comment,
      });
      setRating(0);
      setTitle('');
      setComment('');
      onCancel();
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <h4 className="font-bold text-gray-900 mb-4">Write a Review</h4>

      <div className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Rating *
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'text-[#d4af37] fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent!'}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience with this product..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        <p className="text-xs text-gray-400">
          Your review will be visible after admin approval.
        </p>
      </div>
    </form>
  );
};
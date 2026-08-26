// components/common/RatingStars/RatingStars.jsx
'use client';

import { Star, StarHalf } from 'lucide-react';

export const RatingStars = ({
  rating = 0,
  maxStars = 5,
  size = 'md',
  showNumber = false,
  className = '',
}) => {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const starSize = sizes[size] || sizes.md;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center space-x-0.5 ${className}`}>
      {/* Full Stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`${starSize} text-[#d4af37] fill-current`}
        />
      ))}

      {/* Half Star */}
      {hasHalfStar && (
        <StarHalf
          className={`${starSize} text-[#d4af37] fill-current`}
        />
      )}

      {/* Empty Stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={`${starSize} text-gray-300`}
        />
      ))}

      {showNumber && (
        <span className="ml-1.5 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
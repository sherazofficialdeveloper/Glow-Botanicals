// frontend/src/hooks/useReviews.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '@/services/reviewService';

export const useReviews = (options = {}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 10,
  });

  const fetchReviews = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const request = {
        page: params.page || 1,
        limit: params.limit || 10,
        productId: params.productId,
      };

      if (params.status) request.status = params.status;

      const response = params.admin
        ? await reviewService.getAdminReviews(request)
        : await reviewService.getReviews(request);
      
      setReviews(response.items || []);
      setPagination({
        page: response.currentPage || 1,
        total: response.totalCount || 0,
        totalPages: response.totalPages || 1,
        limit: response.limit || 10,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(options);
  }, [fetchReviews, JSON.stringify(options)]);

  const refetch = useCallback(() => {
    fetchReviews(options);
  }, [fetchReviews, options]);

  return {
    reviews,
    loading,
    error,
    pagination,
    refetch,
  };
};

export const useProductReviews = (productId, options = {}) => {
  return useReviews({ ...options, productId });
};

export default useReviews;
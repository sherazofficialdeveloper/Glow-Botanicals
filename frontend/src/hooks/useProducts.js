// frontend/src/hooks/useProducts.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/productService';

export const useProducts = (options = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 12,
  });

  const fetchProducts = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.getProducts({
        page: params.page || 1,
        limit: params.limit || 12,
        category: params.category,
        search: params.search,
        sort: params.sort,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      });
      
      setProducts(response.items || []);
      setPagination({
        page: response.currentPage || 1,
        total: response.totalCount || 0,
        totalPages: response.totalPages || 1,
        limit: response.limit || 12,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(options);
  }, [fetchProducts, JSON.stringify(options)]);

  const refetch = useCallback(() => {
    fetchProducts(options);
  }, [fetchProducts, options]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
  };
};

export const useFeaturedProducts = (limit = 8) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productService.getFeaturedProducts(limit);
        setProducts(data || []);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [limit]);

  return { products, loading };
};

export const useRelatedProducts = (productId, limit = 4) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchRelated = async () => {
      try {
        const data = await productService.getRelatedProducts(productId, limit);
        setProducts(data || []);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [productId, limit]);

  return { products, loading };
};

export default useProducts;
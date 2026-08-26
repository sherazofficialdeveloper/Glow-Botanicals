// frontend/src/hooks/useCategories.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '@/services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refetch = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch };
};

export const useCategory = (slug) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const data = await categoryService.getCategoryBySlug(slug);
        setCategory(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch category');
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [slug]);

  return { category, loading, error };
};

export const useCategoryProducts = (slug, page = 1, limit = 12) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 12,
  });

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await categoryService.getProductsByCategory(slug, page, limit);
        setProducts(data.items || []);
        setPagination({
          page: data.currentPage || 1,
          total: data.totalCount || 0,
          totalPages: data.totalPages || 1,
          limit: data.limit || 12,
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch category products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug, page, limit]);

  return { products, loading, error, pagination };
};

export default useCategories;
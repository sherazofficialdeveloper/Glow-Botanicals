// frontend/src/hooks/useProduct.js
'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';

export const useProduct = (slug) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await productService.getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const refetch = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const data = await productService.getProductBySlug(slug);
      setProduct(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  return { product, loading, error, refetch };
};

export const useProductById = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

export default useProduct;
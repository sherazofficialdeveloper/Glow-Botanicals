// frontend/src/hooks/useOrders.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { orderService } from '@/services/orderService';
import { useAuth } from './useAuth';

export const useOrders = (options = {}) => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 10,
  });

  const fetchOrders = useCallback(async (params) => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await orderService.getOrders({
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status,
      });
      
      setOrders(response.items || []);
      setPagination({
        page: response.currentPage || 1,
        total: response.totalCount || 0,
        totalPages: response.totalPages || 1,
        limit: response.limit || 10,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchOrders(options);
  }, [fetchOrders, JSON.stringify(options)]);

  const refetch = useCallback(() => {
    fetchOrders(options);
  }, [fetchOrders, options]);

  return {
    orders,
    loading,
    error,
    pagination,
    refetch,
  };
};

export const useOrder = (id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrder(id);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch order');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return { order, loading, error };
};

export default useOrders;
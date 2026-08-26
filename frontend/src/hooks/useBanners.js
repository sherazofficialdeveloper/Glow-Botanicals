// frontend/src/hooks/useBanners.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { bannerService } from '@/services/bannerService';

export const useBanners = (params = {}) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bannerService.getBanners(params);
      setBanners(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch banners');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const refetch = useCallback(() => {
    fetchBanners();
  }, [fetchBanners]);

  return { banners, loading, error, refetch };
};

export default useBanners;
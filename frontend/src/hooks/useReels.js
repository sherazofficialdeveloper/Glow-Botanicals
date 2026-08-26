// frontend/src/hooks/useReels.js
'use client';

import { useState, useEffect } from 'react';
import { reelService } from '@/services/reelService';

export const useReels = (params = {}) => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const data = await reelService.getReels(params);
        setReels(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch reels');
        setReels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, [JSON.stringify(params)]);

  return { reels, loading, error };
};
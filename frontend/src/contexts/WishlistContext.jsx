// frontend/src/contexts/WishlistContext.jsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '@/services/wishlistService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Load wishlist
  const loadWishlist = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated && user) {
        const data = await wishlistService.getWishlist();
        setWishlist(data.items || []);
      } else {
        const localWishlist = localStorage.getItem('guestWishlist');
        if (localWishlist) {
          setWishlist(JSON.parse(localWishlist));
        } else {
          setWishlist([]);
        }
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Save wishlist. Backend is the source of truth for authenticated
  // users: local state only updates AFTER the backend confirms, and
  // errors propagate to the caller instead of being swallowed.
  const saveWishlist = useCallback(async (newWishlist) => {
    if (isAuthenticated && user) {
      const productIds = newWishlist.map(item => item._id || item);
      await wishlistService.syncWishlist(productIds);
      setWishlist(newWishlist);
    } else {
      setWishlist(newWishlist);
      localStorage.setItem('guestWishlist', JSON.stringify(newWishlist));
    }
  }, [isAuthenticated, user]);

  // Toggle wishlist item (add/remove)
  const toggleWishlist = useCallback(async (productId) => {
    const wasInWishlist = wishlist.some(item =>
      (item._id === productId || item === productId)
    );

    try {
      if (isAuthenticated && user) {
        await wishlistService.toggleWishlist(productId);
        await loadWishlist();
      } else {
        const newWishlist = wasInWishlist
          ? wishlist.filter(item => (item._id !== productId && item !== productId))
          : [...wishlist, { _id: productId }];
        await saveWishlist(newWishlist);
      }

      showToast(
        wasInWishlist ? 'Removed from wishlist successfully.' : 'Added to wishlist successfully.',
        wasInWishlist ? 'info' : 'success'
      );
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      showToast(
        error.response?.data?.message || 'Unable to update wishlist. Please try again.',
        'error'
      );
    }
  }, [wishlist, isAuthenticated, user, saveWishlist, loadWishlist, showToast]);

  // Remove a single item from the wishlist
  const removeFromWishlist = useCallback(async (productId) => {
    const newWishlist = wishlist.filter(item =>
      (item._id !== productId && item !== productId)
    );
    try {
      await saveWishlist(newWishlist);
      showToast('Removed from wishlist successfully.', 'info');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      showToast(
        error.response?.data?.message || 'Unable to remove item from wishlist. Please try again.',
        'error'
      );
    }
  }, [wishlist, saveWishlist, showToast]);

  // Clear the entire wishlist
  const clearWishlist = useCallback(async () => {
    try {
      await saveWishlist([]);
      showToast('Wishlist cleared', 'info');
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      showToast(
        error.response?.data?.message || 'Unable to clear wishlist. Please try again.',
        'error'
      );
    }
  }, [saveWishlist, showToast]);

  // Sync guest wishlist with server after login
  const syncWishlist = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const guestWishlist = localStorage.getItem('guestWishlist');
      if (guestWishlist) {
        const guestItems = JSON.parse(guestWishlist);
        if (guestItems.length > 0) {
          const productIds = guestItems.map(item => item._id || item);
          await wishlistService.syncWishlist(productIds);
          localStorage.removeItem('guestWishlist');
        }
      }
      await loadWishlist();
    } catch (error) {
      console.error('Failed to sync wishlist:', error);
    }
  }, [isAuthenticated, user, loadWishlist]);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => (item._id === productId || item === productId));
  }, [wishlist]);

  // Load wishlist on mount and when user changes
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  useEffect(() => {
    if (isAuthenticated && user) {
      syncWishlist();
    }
  }, [isAuthenticated, user, syncWishlist]);

  const value = {
    wishlist,
    loading,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    syncWishlist,
    loadWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export default WishlistContext;

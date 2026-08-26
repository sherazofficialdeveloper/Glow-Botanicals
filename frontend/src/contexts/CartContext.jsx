// frontend/src/contexts/CartContext.jsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '@/services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Load cart. For authenticated users the backend (via formatCart) is
  // the source of truth and already returns each item as
  // { _id, product, quantity, price, variant } — product is the
  // populated Product document. Guest carts use the same shape in
  // localStorage so both paths are interchangeable everywhere else.
  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated && user) {
        const cart = await cartService.getCart();
        setItems(cart.items || []);
      } else {
        const localCart = localStorage.getItem('guestCart');
        setItems(localCart ? JSON.parse(localCart) : []);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Computed values
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price ?? item.price ?? 0;
    return sum + price * (item.quantity || 0);
  }, 0);
  const total = subtotal; // shipping/tax added at checkout

  // Add item — backend confirms before the UI ever shows success.
  const addItem = useCallback(async (product, quantity = 1) => {
    try {
      if (isAuthenticated && user) {
        const cart = await cartService.addItem(product._id, quantity);
        setItems(cart.items || []);
      } else {
        const existingIndex = items.findIndex((item) => item.product?._id === product._id);
        let newItems;
        if (existingIndex > -1) {
          newItems = items.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: (item.quantity || 0) + quantity }
              : item
          );
        } else {
          newItems = [...items, { product, quantity, price: product.price }];
        }
        setItems(newItems);
        localStorage.setItem('guestCart', JSON.stringify(newItems));
      }
      showToast(`${product.name} added to cart successfully.`, 'success');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      showToast(
        error.response?.data?.message || 'Unable to add this product to your cart. Please try again.',
        'error'
      );
    }
  }, [items, isAuthenticated, user, showToast]);

  // Remove item. Callers pass the product ID (matching existing
  // component code) — for authenticated users we resolve that to the
  // cart item's own subdocument _id, which is what the backend's
  // DELETE /cart/:itemId route actually requires.
  const removeItem = useCallback(async (productId) => {
    try {
      if (isAuthenticated && user) {
        const cartItem = items.find((item) => item.product?._id === productId);
        if (!cartItem) return;
        const cart = await cartService.removeItem(cartItem._id);
        setItems(cart.items || []);
      } else {
        const newItems = items.filter((item) => item.product?._id !== productId);
        setItems(newItems);
        localStorage.setItem('guestCart', JSON.stringify(newItems));
      }
      showToast('Item removed from cart', 'info');
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      showToast(
        error.response?.data?.message || 'Unable to remove item from cart. Please try again.',
        'error'
      );
    }
  }, [items, isAuthenticated, user, showToast]);

  // Update quantity — same product-id-to-cart-item-id resolution as
  // removeItem above.
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    try {
      if (isAuthenticated && user) {
        const cartItem = items.find((item) => item.product?._id === productId);
        if (!cartItem) return;
        const cart = await cartService.updateItem(cartItem._id, quantity);
        setItems(cart.items || []);
      } else {
        const newItems = items.map((item) =>
          item.product?._id === productId ? { ...item, quantity } : item
        );
        setItems(newItems);
        localStorage.setItem('guestCart', JSON.stringify(newItems));
      }
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      showToast(
        error.response?.data?.message || 'Unable to update quantity. Please try again.',
        'error'
      );
    }
  }, [items, isAuthenticated, user, removeItem, showToast]);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      if (isAuthenticated && user) {
        const cart = await cartService.clearCart();
        setItems(cart.items || []);
      } else {
        setItems([]);
        localStorage.removeItem('guestCart');
      }
      showToast('Cart cleared', 'info');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      showToast(
        error.response?.data?.message || 'Unable to clear cart. Please try again.',
        'error'
      );
    }
  }, [isAuthenticated, user, showToast]);

  // Sync guest cart with server after login
  const syncCart = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        const guestItems = JSON.parse(guestCart);
        if (guestItems.length > 0) {
          const syncPayload = guestItems
            .filter((item) => item.product?._id)
            .map((item) => ({ id: item.product._id, quantity: item.quantity, variant: item.variant || null }));
          await cartService.syncCart(syncPayload);
          localStorage.removeItem('guestCart');
        }
      }
      await loadCart();
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  }, [isAuthenticated, user, loadCart]);

  // Load cart on mount and when user changes
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (isAuthenticated && user) {
      syncCart();
    }
  }, [isAuthenticated, user, syncCart]);

  const value = {
    items,
    totalItems,
    subtotal,
    total,
    loading,
    isLoading: loading, // alias — some consumers use this name
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    syncCart,
    loadCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default CartContext;

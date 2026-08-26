// backend/src/services/cartService.js

import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { AppError } from '../utils/error.js';
import { logger } from '../utils/logger.js';

/**
 * Get user cart
 */
export const getCart = async (userId) => {
  try {
    let cart = await Cart.findOne({ userId }).populate('items.productId', 'name price images slug stock');

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    return cart;
  } catch (error) {
    logger.error('Get cart service error:', error);
    throw error;
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (userId, productId, quantity = 1, variant = null) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.stock < quantity) {
      throw new AppError('Insufficient stock', 400);
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already exists
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
        variant,
      });
    }

    await cart.save();
    await cart.populate('items.productId', 'name price images slug stock');

    return cart;
  } catch (error) {
    logger.error('Add to cart service error:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (userId, itemId, quantity) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      throw new AppError('Item not found in cart', 404);
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Check stock
      const product = await Product.findById(cart.items[itemIndex].productId);
      if (product && product.stock < quantity) {
        throw new AppError('Insufficient stock', 400);
      }
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.productId', 'name price images slug stock');

    return cart;
  } catch (error) {
    logger.error('Update cart item service error:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (userId, itemId) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      throw new AppError('Item not found in cart', 404);
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate('items.productId', 'name price images slug stock');

    return cart;
  } catch (error) {
    logger.error('Remove from cart service error:', error);
    throw error;
  }
};

/**
 * Clear cart
 */
export const clearCart = async (userId) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    } else {
      cart.items = [];
    }
    await cart.save();

    return cart;
  } catch (error) {
    logger.error('Clear cart service error:', error);
    throw error;
  }
};

export const formatCart = (cart) => {
  const rawItems = cart?.items || [];

  // items.productId holds the populated Product document after
  // Cart.findOne(...).populate('items.productId', ...) — the frontend
  // expects it under the key `product`, and if the referenced product
  // was deleted, populate() resolves it to null; drop those rather
  // than crash the UI on a dangling reference.
  const items = rawItems
    .filter((item) => item.productId)
    .map((item) => ({
      _id: item._id,
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
      variant: item.variant,
    }));

  return {
    items,
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  };
};

export const syncCart = async (userId, items = []) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  for (const item of items) {
    const existing = cart.items.find(
      (ci) =>
        ci.productId.toString() === item.id &&
        JSON.stringify(ci.variant) === JSON.stringify(item.variant)
    );

    if (existing) {
      if (item.quantity > existing.quantity) {
        existing.quantity = item.quantity;
      }
    } else {
      cart.items.push({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
      });
    }
  }

  await cart.save();
  await cart.populate('items.productId', 'name price images slug stock');
  return cart;
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
  formatCart,
};
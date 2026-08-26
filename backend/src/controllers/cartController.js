// backend/src/controllers/cartController.js

import catchAsync from '../utils/catchAsync.js';
import * as cartService from '../services/cartService.js';

export const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  res.json({
    success: true,
    data: cartService.formatCart(cart),
  });
});

export const addToCart = catchAsync(async (req, res) => {
  const { productId, quantity = 1, variant } = req.body;
  const cart = await cartService.addToCart(req.user.id, productId, quantity, variant);
  res.json({
    success: true,
    message: 'Item added to cart',
    data: cartService.formatCart(cart),
  });
});

export const updateCartItem = catchAsync(async (req, res) => {
  const cart = await cartService.updateCartItem(req.user.id, req.params.itemId, req.body.quantity);
  res.json({
    success: true,
    message: 'Cart updated',
    data: cartService.formatCart(cart),
  });
});

export const removeFromCart = catchAsync(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user.id, req.params.itemId);
  res.json({
    success: true,
    message: 'Item removed from cart',
    data: cartService.formatCart(cart),
  });
});

export const syncCart = catchAsync(async (req, res) => {
  const cart = await cartService.syncCart(req.user.id, req.body.items || []);
  res.json({
    success: true,
    message: 'Cart synced successfully',
    data: cartService.formatCart(cart),
  });
});

export const clearCart = catchAsync(async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);
  res.json({
    success: true,
    message: 'Cart cleared',
    data: cartService.formatCart(cart),
  });
});

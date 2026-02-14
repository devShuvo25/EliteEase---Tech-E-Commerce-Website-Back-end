import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CartService } from './cart.service';
import AppError from '../../errors/AppError';

// Add Item to Cart
const createCartItem = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id; // Assuming user id comes from auth middleware
  const result = await CartService.createCartItem(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Item added to cart successfully',
    data: result,
  });
});

// Get User's Cart
const getAllCartItems = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await CartService.getAllCartItems(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Cart retrieved successfully',
    data: result,
  });
});

// Update Cart Item Quantity
const updateCartItemQuantity = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  const result = await CartService.updateCartItemQuantity(
    userId,
    cartItemId,
    quantity
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Cart item quantity updated successfully',
    data: result,
  });
});

// Delete Specific Cart Item
const deleteCartItem = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { cartItemId } = req.params;

  const result = await CartService.deleteCartItem(userId, cartItemId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Item removed from cart successfully',
    data: result,
  });
});

// Clear Entire Cart
const clearCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if(!userId){
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
  const result = await CartService.clearCart(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Cart cleared successfully',
    data: result,
  });
});

export const CartControllers = {
  createCartItem,
  getAllCartItems,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
};
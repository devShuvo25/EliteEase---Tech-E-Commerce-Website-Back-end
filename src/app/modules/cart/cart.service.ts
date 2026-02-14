import { Product } from '@prisma/client';
import prisma from '../../utils/prisma';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const createCartItem = async (userId: string, payload: { productId: string; quantity: number }) => {
  const { productId, quantity } = payload;

  return await prisma.$transaction(async (tx) => {
    // 1. Validate product existence and check stock levels
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
    if (product.stock < quantity) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Requested quantity is not available');
    }

    // 2. Find existing cart or create a new one for the user
    let userCart = await tx.cart.findUnique({
      where: { userId },
    });

    if (!userCart) {
      userCart = await tx.cart.create({ data: { userId } });
    }

    // 3. Check if the product is already in the cart to update quantity or create new record
    const existingItem = await tx.cartItem.findFirst({
      where: { cartId: userCart.id, productId },
    });

    let updatedCartItem;
    if (existingItem) {
      updatedCartItem = await tx.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
      });
    } else {
      updatedCartItem = await tx.cartItem.create({
        data: { cartId: userCart.id, productId, quantity },
      });
    }

    // 4. Deduct the added quantity from the main product stock
    await tx.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });

    return updatedCartItem;
  });
};

const getAllCartItems = async (userId: string) => {
  if (!userId) throw new AppError(httpStatus.BAD_REQUEST, "User ID is required");

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
        },
      },
    },
  });

  // If no cart row exists, return an empty items array instead of null
  return cart || { items: [] };
};

const updateCartItemQuantity = async (userId: string, cartItemId: string, newQuantity: number) => {
  return await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true, cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new AppError(httpStatus.NOT_FOUND, 'Cart item not found');
    }

    // If user sets quantity to 0, handle it as a removal
    if (newQuantity <= 0) return await deleteCartItem(userId, cartItemId);

    const diff = newQuantity - cartItem.quantity;

    // Validate stock if user is increasing quantity
    if (diff > 0 && cartItem.product.stock < diff) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Not enough stock');
    }

    // Sync product stock with the new cart quantity change
    await tx.product.update({
      where: { id: cartItem.productId },
      data: { stock: { decrement: diff } },
    });

    return await tx.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: newQuantity },
    });
  });
};

const deleteCartItem = async (userId: string, cartItemId: string) => {
  return await prisma.$transaction(async (tx) => {
    const item = await tx.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true }
    });
    if (!item) return null;

    if (item.cart.userId !== userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
    await tx.cartItem.delete({ where: { id: cartItemId } });
    return item;
  });
};

const clearCart = async (userId: string) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Check if user has a cart
    const userCart = await tx.cart.findUnique({
      where: { userId },
      include: { items: true }, // Include items directly here for better performance
    });

    if (!userCart || userCart.items.length === 0) {
      return { message: "Cart is already empty", count: 0 };
    }

    // 2. Loop through items to restore product stock levels
    for (const item of userCart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    // 3. Delete all cart items linked to this cart ID
    const deleteResult = await tx.cartItem.deleteMany({ 
      where: { cartId: userCart.id } 
    });

    return { 
      message: "Cart cleared successfully", 
      count: deleteResult.count 
    };
  });
};
export const CartService = {
  createCartItem,
  getAllCartItems,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
};
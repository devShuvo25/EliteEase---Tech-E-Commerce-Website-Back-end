import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { CartControllers } from './cart.controller';
import { CartValidation } from './cart.validation';

const router = express.Router();

// Get User's Cart - GET
router.get(
  '/', 
  auth("CUSTOMER", "ADMIN"),
  CartControllers.getAllCartItems
);

// Add Item to Cart - POST
router.post(
  '/',
  auth("CUSTOMER", "ADMIN"),
  validateRequest(CartValidation.createCartItemValidationSchema),
  CartControllers.createCartItem
);

// Update Cart Item Quantity - PATCH
router.patch(
  '/:cartItemId',
  auth("CUSTOMER"),
  validateRequest(CartValidation.updateCartItemValidationSchema),
  CartControllers.updateCartItemQuantity
);

// Delete Specific Cart Item - DELETE
router.delete(
  '/:cartItemId', 
  auth("CUSTOMER"),
  CartControllers.deleteCartItem
);

// Clear Entire Cart - DELETE
router.delete(
  '/cart/clear-cart', 
  auth("CUSTOMER"),
  CartControllers.clearCart
);

export const CartRoutes = router;
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductControllers } from './product.controller';
import { productValidation } from './product.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

// Create Product - POST
router.post(
  '/',
  auth(),
  validateRequest(productValidation.createProduct),
  ProductControllers.createProduct,
);

// Get All Products - GET
router.get('/', ProductControllers.getAllProducts);

// Get Product By ID - GET
router.get('/:id', ProductControllers.getProductById);

// Update Product - PATCH
router.patch(
  '/:id',
  auth(),
  validateRequest(productValidation.updateProduct),
  ProductControllers.updateProduct,
);

// Delete Product - DELETE
router.delete('/:id', auth(), ProductControllers.deleteProduct);

export const ProductRoutes = router;

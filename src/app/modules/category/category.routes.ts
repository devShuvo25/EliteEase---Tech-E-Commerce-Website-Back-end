import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryControllers } from './category.controller';
import { categoryValidation } from './category.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

// Create Category - POST
router.post(
  '/',
  auth("ADMIN"),
  validateRequest(categoryValidation.createCategory),
  CategoryControllers.createCategory,
);

// Get All Categories - GET
router.get('/', CategoryControllers.getAllCategories);

// Get Category By ID - GET
router.get('/:id', CategoryControllers.getCategoryById);

// Update Category - PATCH
router.patch(
  '/:id',
  auth("ADMIN"),
  validateRequest(categoryValidation.updateCategory),
  CategoryControllers.updateCategory,
);

// Delete Category - DELETE
router.delete('/:id', auth("ADMIN"), CategoryControllers.deleteCategory);

export const CategoryRoutes = router;

// user.route.ts
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { userValidation } from './user.validation';
import auth from '../../middlewares/auth';
// Assume you have auth middleware for roles, e.g., auth('SUPERADMIN', 'ADMIN')
const router = express.Router();


router.get("/my-profile", auth("ADMIN"), UserController.getUserById);

router.get('/',auth("ADMIN"), UserController.getAllUsers); // Add auth('SUPERADMIN')

router.get('/:id',auth("ADMIN"), UserController.getUserById); // Add auth('SUPERADMIN', 'ADMIN')

router.patch(
  '/:id',
  auth("ADMIN"),
  validateRequest(userValidation.updateUser),
  UserController.updateUser,
); // Add auth('SUPERADMIN', 'ADMIN')

router.delete('/:id',auth("ADMIN"), UserController.deleteUser); // Add auth('SUPERADMIN', 'ADMIN')

router.patch(
  '/:id/assign-categories',
  auth("ADMIN"),
  validateRequest(userValidation.assignCategories),
  UserController.assignCategoriesToUser,
); // Add auth('SUPERADMIN', 'ADMIN')

export const UserRoutes = router;

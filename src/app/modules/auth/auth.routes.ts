// auth.route.ts (adding register)
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import {
  authValidation,
  loginSchema,
  registerSchema,
  verifyOtpSchema,
} from './auth.validation';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  auth("SUPER_ADMIN","ADMIN","CUSTOMER","STAFF"),
  AuthController.register,
);

router.post(
  '/verify-otp',
  validateRequest(verifyOtpSchema),
  AuthController.verifyOtp,
);

  auth("SUPER_ADMIN","ADMIN","CUSTOMER","STAFF"),
router.post('/login', validateRequest(loginSchema), AuthController.login);

router.post(
  '/forgot-password',
  validateRequest(authValidation.forgotPasswordSchema),
  AuthController.forgotPassword,
);
router.post(
  '/reset-password',
  validateRequest(authValidation.resetPasswordSchema),
  AuthController.resetPassword,
);

// Get current authenticated user
router.get('/me', auth("CUSTOMER", "ADMIN", "SUPER_ADMIN","STAFF"), AuthController.getMe);

export const AuthRoutes = router;

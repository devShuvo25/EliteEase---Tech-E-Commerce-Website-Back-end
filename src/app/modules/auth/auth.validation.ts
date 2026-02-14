import { z } from 'zod';

// For E-commerce: removed academic fields, added phoneNumber/username
export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    username: z.string().optional(),
    phoneNumber: z.string().optional(),
    role: z.enum(['CUSTOMER', 'ADMIN']).optional().default('CUSTOMER'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  }),
});

export const authValidation = {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
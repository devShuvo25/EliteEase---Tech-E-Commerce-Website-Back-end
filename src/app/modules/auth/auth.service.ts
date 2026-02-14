import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import AppError from '../../errors/AppError';
import { generateToken } from '../../utils/generateToken';
import prisma from '../../utils/prisma';
import { emailService } from '../../utils/email.util';
import {
  ILoginUser,
  IRegisterUser,
  IVerifyOtp,
  IJWTPayload,
} from './auth.interface';
import { ITokenUser } from '../../interface/auth.interface';

/**
 * 1. Register User
 * Creates User (unverified), Profile, Cart, and Wishlist.
 */
const register = async (payload: IRegisterUser) => {
  const isExistUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isExistUser) {
    throw new AppError(httpStatus.CONFLICT, 'User already registered');
  }

  const hashedPassword = await bcrypt.hash(
    payload.password!,
    Number(config.bcrypt_salt_rounds) || 12,
  );

  const result = await prisma.user.create({
    data: {
      email: payload.email,
      password: hashedPassword,
      username: payload.username,
      phoneNumber: payload.phoneNumber,
      role: payload.role || Role.CUSTOMER,
      isEmailVerified: false, // Initial state
      profile: {
        create: {
          firstName: payload.firstName,
          lastName: payload.lastName,
        },
      },
      cart: { create: {} },
      wishlist: { create: {} },
    },
    include: {
      profile: true,
    },
  });

  return result;
};

/**
 * 2. Verify OTP
 * Simply verifies the existing user's email.
 */
const verifyOtp = async (payload: IVerifyOtp) => {
  // Validate OTP record
  const otpRecord = await prisma.otp.findFirst({
    where: {
      email: payload.email,
      otp: payload.otp,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otpRecord) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }

  // Update the actual user
  const user = await prisma.user.update({
    where: { email: payload.email },
    data: { isEmailVerified: true },
  });

  // Cleanup OTP
  await prisma.otp.deleteMany({ where: { email: payload.email } });

  return user;
};

/**
 * 3. Login User
 */
const login = async (payload: ILoginUser) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: { profile: true },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const jwtPayload: IJWTPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.profile?.firstName || '',
    lastName: user.profile?.lastName || '',
    username: user.username,
  };

  const accessToken = generateToken(
    jwtPayload as unknown as ITokenUser, // Cast to 'unknown' first to safely bypass the mismatch
    config.jwt.access_secret as Secret,
    config.jwt.access_expires_in as string,
  );

  return { accessToken };
};

/**
 * 4. Password Recovery
 */
const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found ');

  await prisma.otp.deleteMany({ where: { email } });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.otp.create({
    data: {
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  await emailService.sendPasswordResetOtp(email, otp);
  return { message: 'OTP sent to your email.' };
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const otpRecord = await prisma.otp.findFirst({
    where: { email, otp, expiresAt: { gt: new Date() } },
  });

  if (!otpRecord)
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid/Expired OTP');

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  await prisma.otp.deleteMany({ where: { email } });
  return { message: 'Password reset successfully' };
};

/**
 * 5. Get Current Authenticated User
 * Returns the currently authenticated user's public profile (no password)
 */
const getMe = async (userId: string) => {
  
  const user = await prisma.user.findUnique({

    where: { id: userId },
    include: { profile: true, addresses: true, wishlist: true },
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  // Omit sensitive fields
  const safeUser = { ...user } as any;
  if (safeUser.password) delete safeUser.password;

  return safeUser;
};

export const AuthServices = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyOtp,
  getMe,
};

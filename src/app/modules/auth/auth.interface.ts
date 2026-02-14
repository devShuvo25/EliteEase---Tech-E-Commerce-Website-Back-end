import { Role } from "@prisma/client";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  STAFF = "STAFF"
}

export interface IRegisterUser {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional if using OAuth/Google Login
  
  // E-commerce Specifics
  phoneNumber?: string;
  role: UserRole; 
  
  // Meta / Profile Info
  avatarUrl?: string;
  username?: string; // For SEO/Profile URLs
}

export interface IVerifyOtp {
  email: string;
  otp: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};
export type IForgotPassword = {
  email: string;
};
export type IResetPassword = {
  email: string;
  otp: string;
  newPassword: string;
};
export type IUpdateProfile = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  age?: number;
};

export interface IJWTPayload {
  id: string;          // The unique User ID (UUID or CUID)
  email: string;       // Used for identification
  role: Role;          // Used for RBAC (Role-Based Access Control)
  firstName: string;   // Useful for displaying "Hello, John" in the UI
  lastName: string;    // Useful for invoices/shipping headers
  username?: string | null; // Optional, useful for profile URLs
}
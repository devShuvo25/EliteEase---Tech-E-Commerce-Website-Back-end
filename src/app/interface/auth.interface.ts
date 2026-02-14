import { Role } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

export interface ITokenUser {
  id: string;
  email: string;
  role: Role;        // Using the Prisma Role enum for strict typing
  firstName: string;
  lastName: string;
  username?: string | null;
  phoneNumber?: string;
}

// This interface is used for decoded tokens in middleware
export interface IDecodedUser extends JwtPayload, ITokenUser {}
// User role and status enums (matching prisma schema)
export type Role = 'CUSTOMER' | 'STAFF' | 'ADMIN';
export type Status = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface IUser {
  id: string;
  email: string;
  username?: string;
  password: string;
  phoneNumber?: string;
  role: Role;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: Role;
  status?: Status;
}

export interface IAssignCategories {
  categoryIds: string[];
}

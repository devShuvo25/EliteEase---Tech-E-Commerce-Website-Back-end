// user.service.ts
import * as bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import { IUpdateUser } from './user.interface';

// user.service.ts

interface IGetAllUsersParams {
  page?: number;
  limit?: number;
}

const getAllUsersFromDB = async (params?: IGetAllUsersParams) => {
  const page = params?.page && params.page > 0 ? params.page : 1;
  const limit = params?.limit && params.limit > 0 ? params.limit : 5;
  const skip = (page - 1) * limit;

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: { firstName: true, lastName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const getUserByIdFromDB = async (id: string) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User ID is missing from request');
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
      profile: { 
        select: { 
          firstName: true, 
          lastName: true, 
          avatarUrl: true 
        } 
      },
    },
  });

  // যদি ডাটাবেসে এই আইডি না থাকে
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, `User not found with ID: ${id}`);
  }

  return user;
};

const updateUserIntoDB = async (id: string, payload: IUpdateUser) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }
  const user = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
      profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
    },
  });
  // If changing to ADMIN, you may want to add admin-specific logic here if needed.
  return user;
};

const deleteUserFromDB = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  await prisma.user.delete({ where: { id } });
  return { id };
};

const assignCategoriesToUserDB = async (
  userId: string,
  categoryIds: string[],
) => {
  throw new AppError(
    httpStatus.NOT_IMPLEMENTED,
    'Category assignment to user is not supported in current schema',
  );
};

export const UserServices = {
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
  assignCategoriesToUserDB,
};

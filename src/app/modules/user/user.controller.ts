import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const result = await UserServices.getAllUsersFromDB({ page, limit });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
    data: result.data,
    meta: {
      ...result.meta,
      totalPage: result.meta.totalPages,
    },
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const userId= req.user?.id;
  const result = await UserServices.getUserByIdFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.updateUserIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.deleteUserFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User deleted successfully',
    data: result,
  });
});

const assignCategoriesToUser = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { categoryIds } = req.body;
    const result = await UserServices.assignCategoriesToUserDB(id, categoryIds);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Categories assigned to user successfully',
      data: result,
    });
  },
);

export const UserController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignCategoriesToUser,
};

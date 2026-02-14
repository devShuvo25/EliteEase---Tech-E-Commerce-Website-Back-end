import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';

// Create Category
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.createCategoryIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Category created successfully',
    data: result,
  });
});

// Get All Categories
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const parentId = req.query.parentId ? String(req.query.parentId) : undefined;

  const result = await CategoryServices.getAllCategoriesFromDB({
    page,
    limit,
    parentId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Categories retrieved successfully',
    data: result.data,
    meta: {
      page: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
      totalPage: result.meta.totalPages,
    },
  });
});

// Get Category By ID
const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryServices.getCategoryByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category retrieved successfully',
    data: result,
  });
});

// Update Category
const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryServices.updateCategoryIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category updated successfully',
    data: result,
  });
});

// Delete Category
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryServices.deleteCategoryFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

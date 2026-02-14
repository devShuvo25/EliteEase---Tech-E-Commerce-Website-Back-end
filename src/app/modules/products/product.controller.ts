import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

// Create Product
const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.createProductIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Product created successfully',
    data: result,
  });
});

// Get All Products
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const categoryId = req.query.categoryId
    ? String(req.query.categoryId)
    : undefined;
  const search = req.query.search ? String(req.query.search) : undefined;
  const isActive = req.query.isActive
    ? req.query.isActive === 'true'
    : undefined;
  const isFeatured = req.query.isFeatured
    ? req.query.isFeatured === 'true'
    : undefined;

  const result = await ProductServices.getAllProductsFromDB({
    page,
    limit,
    categoryId,
    search,
    isActive,
    isFeatured,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Products retrieved successfully',
    data: result.data,
    meta: {
      page: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
      totalPage: result.meta.totalPages,
    },
  });
});

// Get Product By ID
const getProductById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.getProductByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Product retrieved successfully',
    data: result,
  });
});

// Update Product
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.updateProductIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Product updated successfully',
    data: result,
  });
});

// Delete Product
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProductServices.deleteProductFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Product deleted successfully',
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

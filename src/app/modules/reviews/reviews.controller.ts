import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './reviews.service';

// Create Review
const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Unauthorized - User ID not found',
      data: null,
    });
  }

  const result = await ReviewServices.createReviewIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Review submitted successfully and is pending approval',
    data: result,
  });
});

// Get All Reviews
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const productId = req.query.productId
    ? String(req.query.productId)
    : undefined;
  const userId = req.query.userId ? String(req.query.userId) : undefined;
  // status removed from schema
  const minRating = req.query.minRating
    ? Number(req.query.minRating)
    : undefined;
  const maxRating = req.query.maxRating
    ? Number(req.query.maxRating)
    : undefined;

  const result = await ReviewServices.getAllReviewsFromDB({
    page,
    limit,
    productId,
    userId,
    minRating,
    maxRating,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Reviews retrieved successfully',
    data: result.data,
    meta: {
      page: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
      totalPage: result.meta.totalPages,
    },
  });
});

// Get Reviews By Product ID
const getReviewsByProductId = catchAsync(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const sortBy = req.query.sortBy as
      | 'recent'
      | 'highest'
      | 'lowest'
      | undefined;

    const result = await ReviewServices.getReviewsByProductIdFromDB(productId, {
      page,
      limit,
      sortBy,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Product reviews retrieved successfully',
      data: result.data,
      meta: result.meta as any,
    });
  },
);

// Get Review By ID
const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewServices.getReviewByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Review retrieved successfully',
    data: result,
  });
});

// Update Review
const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Unauthorized - User ID not found',
      data: null,
    });
  }

  const result = await ReviewServices.updateReviewIntoDB(id, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Review updated successfully and is pending re-approval',
    data: result,
  });
});

// Delete Review
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      message: 'Unauthorized - User ID not found',
      data: null,
    });
  }

  const result = await ReviewServices.deleteReviewFromDB(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Review deleted successfully',
    data: result,
  });
});

// Moderation and helpful-vote endpoints removed (not in current schema)

export const ReviewControllers = {
  createReview,
  getAllReviews,
  getReviewsByProductId,
  getReviewById,
  updateReview,
  deleteReview,
};

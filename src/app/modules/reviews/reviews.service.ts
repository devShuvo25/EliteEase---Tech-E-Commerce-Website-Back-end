import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';

// Create Review Service
const createReviewIntoDB = async (
  userId: string,
  payload: {
    rating: number;
    comment?: string;
    productId: string;
  },
) => {
  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: payload.productId },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Check if user already reviewed this product
  // Allow one review per user per product
  const existingReview = await prisma.review.findFirst({
    where: { userId, productId: payload.productId },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.CONFLICT,
      'You have already reviewed this product',
    );
  }

  const review = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      productId: payload.productId,
      userId,
    },
    include: {
      user: { select: { id: true, email: true } },
      product: { select: { id: true, name: true } },
    },
  });

  // Update product aggregated rating
  await updateProductRating(payload.productId);

  return review;
};

// Get All Reviews Service
const getAllReviewsFromDB = async (params?: {
  page?: number;
  limit?: number;
  productId?: string;
  userId?: string;
  minRating?: number;
  maxRating?: number;
}) => {
  const page = params?.page && params.page > 0 ? params.page : 1;
  const limit = params?.limit && params.limit > 0 ? params.limit : 10;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (params?.productId) {
    whereClause.productId = params.productId;
  }

  if (params?.userId) {
    whereClause.userId = params.userId;
  }

  // No moderation status in current schema; return all matching reviews

  if (params?.minRating || params?.maxRating) {
    whereClause.rating = {};
    if (params?.minRating) {
      whereClause.rating.gte = params.minRating;
    }
    if (params?.maxRating) {
      whereClause.rating.lte = params.maxRating;
    }
  }

  const [reviews, total] = await prisma.$transaction([
    prisma.review.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        // no review images in current schema
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count({ where: whereClause }),
  ]);

  return {
    data: reviews,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Review By ID Service
const getReviewByIdFromDB = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true } },
      product: { select: { id: true, name: true } },
    },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  return review;
};

// Update Review Service
const updateReviewIntoDB = async (
  id: string,
  userId: string,
  payload: {
    rating?: number;
    comment?: string;
  },
) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  // Check if user owns the review
  if (review.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only update your own reviews',
    );
  }

  const updatedReview = await prisma.review.update({
    where: { id },
    data: {
      ...(payload.rating !== undefined && { rating: payload.rating }),
      ...(payload.comment && { comment: payload.comment }),
    },
    include: {
      user: { select: { id: true, email: true } },
      product: { select: { id: true, name: true } },
    },
  });

  // Recalculate product rating
  await updateProductRating(updatedReview.productId);

  return updatedReview;
};

// Delete Review Service
const deleteReviewFromDB = async (id: string, userId: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  // Check if user owns the review
  if (review.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only delete your own reviews',
    );
  }

  await prisma.review.delete({
    where: { id },
  });

  // Recalculate product rating after delete
  await updateProductRating(review.productId);

  return { id, message: 'Review deleted successfully' };
};

// Approve/Reject Review Service (Admin only)
// Note: moderation, helpful votes, and review images were removed from schema

// Helper function to update product average rating
const updateProductRating = async (productId: string) => {
  const result = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { id: true },
  });

  const averageRating = result._avg.rating ? Number(result._avg.rating) : 0;
  const totalReviews = result._count.id || 0;

  await prisma.product.update({
    where: { id: productId },
    data: {
      avgRating: averageRating,
      reviewCount: totalReviews,
    },
  });
};

// Get Reviews By Product ID Service
const getReviewsByProductIdFromDB = async (
  productId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: 'helpful' | 'recent' | 'highest' | 'lowest';
  },
) => {
  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const page = params?.page && params.page > 0 ? params.page : 1;
  const limit = params?.limit && params.limit > 0 ? params.limit : 10;
  const skip = (page - 1) * limit;
  const sortBy = params?.sortBy || 'recent';

  const orderByClause: any = {};

  // Determine sort order
  switch (sortBy) {
    case 'highest':
      orderByClause.rating = 'desc';
      break;
    case 'lowest':
      orderByClause.rating = 'asc';
      break;
    case 'recent':
    default:
      orderByClause.createdAt = 'desc';
  }

  const [reviews, total, ratingStats] = await prisma.$transaction([
    prisma.review.findMany({
      where: { productId },
      skip,
      take: limit,
      include: { user: { select: { id: true, email: true } } },
      orderBy: orderByClause,
    }),
    prisma.review.count({ where: { productId } }),
    prisma.review.groupBy({
      by: ['rating'],
      where: { productId },
      orderBy: { rating: 'desc' },
      _count: { id: true },
    }),
  ]);

  // Calculate rating distribution
  const ratingDistribution: any = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  ratingStats.forEach((stat: any) => {
    ratingDistribution[stat.rating] = stat._count.id;
  });

  return {
    data: reviews,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      averageRating: product.avgRating,
      totalReviews: product.reviewCount,
      ratingDistribution,
    },
  };
};

export const ReviewServices = {
  createReviewIntoDB,
  getAllReviewsFromDB,
  getReviewByIdFromDB,
  getReviewsByProductIdFromDB,
  updateReviewIntoDB,
  deleteReviewFromDB,
};

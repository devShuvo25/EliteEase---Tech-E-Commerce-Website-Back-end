import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';

// Create Product Service
const createProductIntoDB = async (payload: {
  name: string;
  description: string;
  // summary?: string;
  basePrice: number | string;
  compareAtPrice?: number | string;
  brand?: string;
  sku: string;
  weight?: number;
  dimensions?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  categoryId: string;
}) => {
  // Check if product with same name or sku already exists (sku checked below)

  // Check if SKU already exists
  const existingSku = await prisma.product.findUnique({
    where: { sku: payload.sku },
  });

  if (existingSku) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Product with this SKU already exists',
    );
  }

  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const product = await prisma.product.create({
    data: {
      name: payload.name,
      description: payload.description,
      // summary: payload.summary,
      basePrice: payload.basePrice,
      compareAtPrice: payload.compareAtPrice,
      brand: payload.brand,
      sku: payload.sku,
      categoryId: payload.categoryId,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      // variants removed from schema
      images: {
        select: {
          id: true,
          url: true,
          isMain: true,
        },
      },
      _count: {
        select: {
          reviews: true,
          tags: true,
        },
      },
    },
  });

  return product;
};

// Get All Products Service
const getAllProductsFromDB = async (params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}) => {
  const page = params?.page && params.page > 0 ? params.page : 1;
  const limit = params?.limit && params.limit > 0 ? params.limit : 10;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (params?.categoryId) {
    whereClause.categoryId = params.categoryId;
  }

  if (params?.search) {
    whereClause.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { sku: { contains: params.search, mode: 'insensitive' } },
    ];
  }
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        // include full related data so callers get all product properties
        category: true,
        images: true,
        specifications: true,
        tags: true,
        // include a small set of recent reviews
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            userId: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        questions: true,
        blogPost: true,
        _count: {
          select: {
            reviews: true,
            tags: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  return {
    data: products,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Product By ID Service
const getProductByIdFromDB = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      // variants removed from schema
      images: true,
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: {
          reviews: true,
          tags: true,
        },
      },
    },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return product;
};

// Update Product Service
const updateProductIntoDB = async (
  id: string,
  payload: {
    name?: string;
    description?: string;
    // summary?: string;
    basePrice?: number | string;
    compareAtPrice?: number | string;
    brand?: string;
    sku?: string;
    categoryId?: string;
  },
) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Check if new slug already exists (excluding current product)
  // slug removed from schema; skip slug uniqueness check

  // Check if new SKU already exists (excluding current product)
  if (payload.sku && payload.sku !== product.sku) {
    const existingSku = await prisma.product.findUnique({
      where: { sku: payload.sku },
    });

    if (existingSku) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Product with this SKU already exists',
      );
    }
  }

  // Check if category exists (if provided)
  if (payload.categoryId && payload.categoryId !== product.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.description && { description: payload.description }),
      // ...(payload.summary !== undefined && { summary: payload.summary }),
      ...(payload.basePrice && { basePrice: payload.basePrice }),
      ...(payload.compareAtPrice !== undefined && {
        compareAtPrice: payload.compareAtPrice,
      }),
      ...(payload.brand !== undefined && { brand: payload.brand }),
      ...(payload.sku && { sku: payload.sku }),
      ...(payload.categoryId && { categoryId: payload.categoryId }),
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      // variants removed from schema
      images: {
        select: {
          id: true,
          url: true,
          isMain: true,
        },
      },
      _count: {
        select: {
          reviews: true,
          tags: true,
        },
      },
    },
  });

  return updatedProduct;
};

// Delete Product Service
const deleteProductFromDB = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  await prisma.product.delete({
    where: { id },
  });

  return { id, message: 'Product deleted successfully' };
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getProductByIdFromDB,
  updateProductIntoDB,
  deleteProductFromDB,
};

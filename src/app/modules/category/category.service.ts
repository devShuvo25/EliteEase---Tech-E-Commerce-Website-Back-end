import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';

// Create Category Service
const createCategoryIntoDB = async (payload: {
  name: string;
  parentId?: string;
}) => {
  // Check if parent category exists (if parentId is provided)
  if (payload?.parentId) {
    const parentCategory = await prisma.category.findUnique({
      where: { id: payload.parentId },
    });

    if (!parentCategory) {
      throw new AppError(httpStatus.NOT_FOUND, 'Parent category not found');
    }
  }

  const category = await prisma.category.create({
    data: {
      name: payload.name,
      parentId: payload.parentId,
    },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
        },
      },
      children: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return category;
};

// Get All Categories Service
const getAllCategoriesFromDB = async (params?: {
  page?: number;
  limit?: number;
  parentId?: string;
}) => {
  const page = params?.page && params.page > 0 ? params.page : 1;
  const limit = params?.limit && params.limit > 0 ? params.limit : 10;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (params?.parentId) {
    whereClause.parentId = params.parentId;
  }

  const [categories, total] = await prisma.$transaction([
    prisma.category.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.category.count({ where: whereClause }),
  ]);

  return {
    data: categories,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Category By ID Service
const getCategoryByIdFromDB = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
        },
      },
      children: {
        select: {
          id: true,
          name: true,
        },
      },
      products: {
        select: {
          id: true,
          name: true,
          basePrice: true,
        },
        take: 10, // Limit to 10 products
      },
      _count: {
        select: {
          products: true,
          children: true,
        },
      },
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  return category;
};

// Update Category Service
const updateCategoryIntoDB = async (
  id: string,
  payload: {
    name?: string;
    parentId?: string;
  },
) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  // Check if parent category exists (if parentId is provided)
  if (payload.parentId && payload.parentId !== category.parentId) {
    const parentCategory = await prisma.category.findUnique({
      where: { id: payload.parentId },
    });

    if (!parentCategory) {
      throw new AppError(httpStatus.NOT_FOUND, 'Parent category not found');
    }

    // Prevent category from being its own parent or creating circular references
    if (payload.parentId === id) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Category cannot be its own parent',
      );
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.parentId && { parentId: payload.parentId }),
    },
    include: {
      parent: {
        select: {
          id: true,
          name: true,
        },
      },
      children: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return updatedCategory;
};

// Delete Category Service
const deleteCategoryFromDB = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      children: true,
      products: true,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }

  if (category.children.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete category that has subcategories. Please delete or reassign subcategories first.',
    );
  }

  if (category.products.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot delete category that has products. Please reassign or delete products first.',
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  return { id, message: 'Category deleted successfully' };
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getCategoryByIdFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};

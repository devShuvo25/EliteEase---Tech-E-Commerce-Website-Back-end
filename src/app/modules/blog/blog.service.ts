import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';

// Create Blog Post Service
const createBlogIntoDB = async (payload: {
  title: string;
  content: string;
  bannerImage?: string;
  authorName?: string;
  productId: string;
  images?: { url: string; altText?: string; order?: number }[];
}) => {
  // slug removed from schema; skip slug uniqueness check

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: payload.productId },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const blogPost = await prisma.blogPost.create({
    data: {
      title: payload.title,
      content: payload.content,
      bannerImage: payload.bannerImage,
      authorName: payload.authorName,
      productId: payload.productId,
      images: {
        create: payload.images || [],
      },
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          altText: true,
          order: true,
        },
      },
    },
  });

  return blogPost;
};

// Get All Blog Posts Service
const getAllBlogsFromDB = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const page = params?.page && params.page > 0 ? params.page : 1;
  const limit = params?.limit && params.limit > 0 ? params.limit : 10;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (params?.search) {
    whereClause.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { content: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const [blogPosts, total] = await prisma.$transaction([
    prisma.blogPost.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            altText: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.blogPost.count({ where: whereClause }),
  ]);

  return {
    data: blogPosts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Blog Post By ID Service
const getBlogByIdFromDB = async (id: string) => {
  const blogPost = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          altText: true,
          order: true,
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!blogPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog post not found');
  }

  return blogPost;
};

// Update Blog Post Service
const updateBlogIntoDB = async (
  id: string,
  payload: {
    title?: string;
    content?: string;
    bannerImage?: string;
    authorName?: string;
    productId?: string;
    images?: { id?: string; url: string; altText?: string; order?: number }[];
  },
) => {
  const blogPost = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!blogPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog post not found');
  }

  // slug removed from schema; skip slug uniqueness check

  // Check if product exists (if provided)
  if (payload.productId && payload.productId !== blogPost.productId) {
    const product = await prisma.product.findUnique({
      where: { id: payload.productId },
    });

    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }
  }

  const updatedBlog = await prisma.blogPost.update({
    where: { id },
    data: {
      ...(payload.title && { title: payload.title }),
      ...(payload.content && { content: payload.content }),
      ...(payload.bannerImage !== undefined && {
        bannerImage: payload.bannerImage,
      }),
      ...(payload.authorName !== undefined && {
        authorName: payload.authorName,
      }),
      ...(payload.productId && { productId: payload.productId }),
      images: {
        deleteMany: { blogPostId: id }, // Delete existing images for this blog post
        create: payload.images || [], // Recreate all images
      },
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          altText: true,
          order: true,
        },
      },
    },
  });

  return updatedBlog;
};

// Delete Blog Post Service
const deleteBlogFromDB = async (id: string) => {
  const blogPost = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!blogPost) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog post not found');
  }

  await prisma.blogPost.delete({
    where: { id },
  });

  return { id, message: 'Blog post deleted successfully' };
};

export const BlogServices = {
  createBlogIntoDB,
  getAllBlogsFromDB,
  getBlogByIdFromDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
};

import z from 'zod';

const createBlogImage = z.object({
  url: z.string().url('Image URL is required and must be a valid URL'),
  altText: z.string().optional(),
  order: z.number().int().min(0).optional().default(0),
});

const updateBlogImage = z.object({
  id: z.string().optional(), // ID is required for existing images if updating specific ones
  url: z.string().url('Image URL must be a valid URL').optional(),
  altText: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

const createBlog = z.object({
  body: z.object({
    title: z.string().min(1, 'Blog title is required'),
    content: z.string().min(1, 'Blog content is required'),
    bannerImage: z.string().url('Banner image must be a valid URL').optional(),
    authorName: z.string().optional().default('Admin'),
    productId: z.string().min(1, 'Product ID is required'),
    images: z.array(createBlogImage).optional(),
  }),
});

const updateBlog = z.object({
  body: z.object({
    title: z.string().min(1, 'Blog title is required').optional(),
    content: z.string().min(1, 'Blog content is required').optional(),
    bannerImage: z.string().url('Banner image must be a valid URL').optional(),
    authorName: z.string().optional(),
    productId: z.string().min(1, 'Product ID is required').optional(),
    images: z.array(updateBlogImage).optional(),
  }),
});

export const blogValidation = {
  createBlog,
  updateBlog,
};

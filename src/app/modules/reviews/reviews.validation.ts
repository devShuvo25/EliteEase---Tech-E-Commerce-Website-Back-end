import z from 'zod';

const createReview = z.object({
  body: z.object({
    rating: z
      .number()
      .int()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5'),
    comment: z
      .string()
      .min(10, 'Comment must be at least 10 characters')
      .max(5000, 'Comment is too long')
      .optional(),
    productId: z.string().min(1, 'Product ID is required'),
  }),
});

const updateReview = z.object({
  body: z.object({
    rating: z
      .number()
      .int()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5')
      .optional(),
    comment: z
      .string()
      .min(10, 'Comment must be at least 10 characters')
      .max(5000, 'Comment is too long')
      .optional(),
  }),
});
export const reviewValidation = {
  createReview,
  updateReview,
};

import z from 'zod';

const createCategory = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
    parentId: z.string().optional(),
  }),
});

const updateCategory = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required').optional(),
    parentId: z.string().optional(),
  }),
});

export const categoryValidation = {
  createCategory,
  updateCategory,
};

import z from 'zod';

const createProduct = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Product description is required'),
    // summary: z.string().optional(),
    basePrice: z
      .string()
      .or(z.number())
      .refine(val => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return num > 0;
      }, 'Base price must be greater than 0'),
    compareAtPrice: z
      .string()
      .or(z.number())
      .optional()
      .refine(val => {
        if (!val) return true;
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return num > 0;
      }, 'Compare at price must be greater than 0'),
    brand: z.string().optional(),
    sku: z.string().min(1, 'SKU is required'),
    categoryId: z.string().min(1, 'Category ID is required'),
  }),
});

const updateProduct = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required').optional(),
    description: z
      .string()
      .min(1, 'Product description is required')
      .optional(),
    // summary: z.string().optional(),
    basePrice: z
      .string()
      .or(z.number())
      .optional()
      .refine(val => {
        if (!val) return true;
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return num > 0;
      }, 'Base price must be greater than 0'),
    compareAtPrice: z
      .string()
      .or(z.number())
      .optional()
      .refine(val => {
        if (!val) return true;
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return num > 0;
      }, 'Compare at price must be greater than 0'),
    brand: z.string().optional(),
    sku: z.string().optional(),
    categoryId: z.string().min(1, 'Category ID is required').optional(),
  }),
});

export const productValidation = {
  createProduct,
  updateProduct,
};

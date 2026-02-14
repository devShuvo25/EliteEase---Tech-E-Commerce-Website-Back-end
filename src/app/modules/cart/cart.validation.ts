import { z } from 'zod';

const createCartItemValidationSchema = z.object({
  body: z.object({
    productId: z.string({
      required_error: 'Product ID is required',
    }),
    quantity: z.number({
      required_error: 'Quantity is required',
    }),
  }),
});

const updateCartItemValidationSchema = z.object({
  body: z.object({
    quantity: z.number().optional(),
  }),
});

export const CartValidation = {
  createCartItemValidationSchema,
  updateCartItemValidationSchema,
};

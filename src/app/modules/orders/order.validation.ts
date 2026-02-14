import { z } from 'zod';

const productSchema = z.object({
  productId: z.string().nonempty({ message: 'Product ID is required' }),
  quantity: z
    .number()
    .int()
    .positive({ message: 'Quantity must be a positive integer' }),
});

const createOrderValidationSchema = z.object({
  body: z.object({
    products: z
      .array(productSchema)
      .nonempty({ message: 'At least one product is required' }),
    totalAmount: z
      .number()
      .positive({ message: 'Total amount must be a positive number' }),
    shippingAddress: z.object({
      street: z.string().nonempty({ message: 'Street is required' }),
      city: z.string().nonempty({ message: 'City is required' }),
      country: z.string().nonempty({ message: 'Country is required' }),
      postalCode: z.string().nonempty({ message: 'Postal code is required' }),
    }),
    paymentMethod: z.enum(['Credit Card', 'Cash on Delivery'], {
      invalid_type_error: 'Invalid payment method',
    }),
    user: z.string().nonempty({ message: 'User ID is required' }),
  }),
});

export const OrderValidation = {
  createOrderValidationSchema,
};

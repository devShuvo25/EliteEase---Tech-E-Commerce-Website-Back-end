// user.validation.ts
import z from 'zod';

const updateUser = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['CUSTOMER', 'STAFF', 'ADMIN']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']).optional(),
  }),
});

const assignCategories = z.object({
  body: z.object({
    categoryIds: z.array(z.string()),
  }),
});

export const userValidation = { updateUser, assignCategories };

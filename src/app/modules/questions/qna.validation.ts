import { z } from 'zod';

const createQuestionValidation = z.object({
  body: z.object({
    content: z.string({
      required_error: 'Question content is required',
    }),
    productId: z.string({
      required_error: 'Product ID is required',
    }),
  }),
});

const createAnswerValidation = z.object({
  body: z.object({
    content: z.string({
      required_error: 'Answer content is required',
    }),
  }),
});

const updateQuestionValidation = z.object({
  body: z.object({
    content: z.string().optional(),
    isPublished: z.boolean().optional(),
  }),
});

const updateAnswerValidation = z.object({
  body: z.object({
    content: z.string().optional(),
  }),
});

export const createQuestionValidationSchema = createQuestionValidation;
export const qnaValidation = {
  createQuestionValidation,
  createAnswerValidation,
  updateQuestionValidation,
  updateAnswerValidation,
};

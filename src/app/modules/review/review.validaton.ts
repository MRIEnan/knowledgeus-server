import { z } from 'zod';

const createReviewZodSchema = z.object({
  body: z.object({
    review: z.string({ required_error: 'review is required' }),
    rating: z.number({ required_error: 'rating is required' }),
  }),
});

const updateReviewZodSchema = z.object({
  body: z.object({
    review: z.string().optional(),
    rating: z.number().optional(),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
};

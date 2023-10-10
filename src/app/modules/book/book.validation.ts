import { z } from 'zod';

const createBookZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is required' }),
    accessIds: z.string({ required_error: 'accessIds is required' }),
    imageLink: z.string().optional(),
    description: z.string({ required_error: 'description is required' }),
    author: z.array(z.string({ required_error: 'author is required' }), {
      required_error: 'author array is required',
    }),
    genre: z.string({ required_error: 'genre is required' }),
  }),
});

const updateBookZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    author: z.array(z.string().optional()).optional(),
    publicationDate: z.string().optional(),
    genre: z.string().optional(),
    imageLink: z.string().optional(),
  }),
});

export const BookValidation = {
  createBookZodSchema,
  updateBookZodSchema,
};

import { z } from 'zod';
import { WishlistArr } from './wishlist.constant';

const createWishlistZodSchema = z.object({
  body: z.object({
    bookId: z.string({ required_error: 'bookId is required' }),
  }),
});

const updateWishlistZodSchema = z.object({
  body: z.object({
    _id: z.string({}),
    status: z.enum([...WishlistArr] as [string, ...string[]], {
      required_error: 'wishlist is required',
    }),
  }),
});

export const WishlistValidation = {
  createWishlistZodSchema,
  updateWishlistZodSchema,
};

import { z } from 'zod';
const createUserZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'email is required' }).email(),
    userName: z.string({ required_error: 'userName is required' }),
    // role: z.enum(['general', 'admin'] as [string, ...string[]], {
    //   required_error: 'role is required',
    // }),
    password: z.string({ required_error: 'password is required' }),
  }),
});
export const UserValidation = {
  createUserZodSchema,
};

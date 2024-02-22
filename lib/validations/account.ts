import * as z from 'zod';

export const AccountValidation = z.object({
  name: z.string().nonempty({
    message: 'Name should not be empty',
  }),
  username: z.string().min(3, {
    message: 'Username should be at least 3 characters',
  }),
  email: z.string().email({
    message: 'Email is not valid',
  }),
  password: z.string().min(8, {
    message: 'Password should be at least 8 characters',
  }),
  phoneNumber: z.string().nonempty({
    message: 'Phone number should not be empty',
  }),
  address: z.string().nonempty({
    message: 'Address should not be empty',
  }),
  image: z.string(),
});

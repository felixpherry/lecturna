import * as z from 'zod';

export const UserValidation = z.object({
  email: z
    .string()
    .email({
      message: 'Masukkan email yang valid',
    })
    .nonempty(),
  password: z.string().nonempty({
    message: 'Masukkan password yang valid',
  }),
});

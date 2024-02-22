import * as z from 'zod';

export const PhoneNumberValidation = z
  .string({
    required_error: 'Phone number is required',
  })
  .regex(new RegExp('0.{9,}'), {
    message: 'Phone number is invalid',
  });

export const PhoneNumberValidationIDN = z
  .string({
    required_error: 'No. HP wajib diisi',
  })
  .regex(new RegExp('0.{9,}'), {
    message: 'No. HP tidak valid',
  });

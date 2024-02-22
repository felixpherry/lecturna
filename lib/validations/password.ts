import * as z from 'zod';

export const PasswordValidation = z
  .string({
    required_error: 'Password is required',
  })
  .regex(
    new RegExp('.*[A-Z].*'),
    'Password should contain at least one uppercase character'
  )
  .regex(
    new RegExp('.*[a-z].*'),
    'Password should contain at least one lowercase character'
  )
  .regex(new RegExp('.*\\d.*'), 'Password should contain at least one number')
  .regex(
    new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
    'Password should contain at least one special character'
  )
  .min(8, 'Password should be at least 8 characters');

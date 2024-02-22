import * as z from 'zod';
import { PhoneNumberValidationIDN } from './phone-number';

export const TrialClassValidation = z.object({
  childName: z.string().min(1, {
    message: 'Nama anak wajib diisi',
  }),
  dateOfBirth: z.coerce.date({
    required_error: 'Tanggal lahir wajib diisi',
  }),
  birthPlace: z.string().min(1, {
    message: 'Tempat lahir anak wajib diisi',
  }),
  parentName: z.string().min(1, {
    message: 'Nama orang tua wajib diisi',
  }),
  phoneNumber: PhoneNumberValidationIDN,
  email: z
    .string()
    .email({
      message: 'Masukkan email yang valid',
    })
    .min(1),
  trialClassDate: z.date(),
  courseId: z.string().min(1, {
    message: 'Kursus wajib dipilih',
  }),
});

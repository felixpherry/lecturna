'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PasswordValidation } from '@/lib/validations/password';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, PasswordInput } from '@mantine/core';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input as FileInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useStudentOnboardingStore } from '../_stores/use-student-onboarding-store';

const formSchema = z
  .object({
    username: z.string().min(1, {
      message: 'Username is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({
        message: 'Email is invalid',
      }),
    password: PasswordValidation,
    confirmPassword: PasswordValidation,
    image: z.string().min(1, {
      message: 'Profile photo is required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['password'],
  });

const StudentAccountDetailForm = () => {
  const accountDetail = useStudentOnboardingStore(
    (state) => state.accountDetail
  );
  const setAccountDetail = useStudentOnboardingStore(
    (state) => state.setAccountDetail
  );
  const setProfilePhoto = useStudentOnboardingStore(
    (state) => state.setProfilePhoto
  );
  const stepForward = useStudentOnboardingStore((state) => state.stepForward);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: accountDetail.email || '',
      username: accountDetail.username || '',
      image: accountDetail.image || '',
      password: accountDetail.password || '',
      confirmPassword: accountDetail.confirmPassword || '',
    },
  });

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfilePhoto(Array.from(e.target.files));

      if (!file.type.includes('image')) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';

        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setAccountDetail(values);
    stepForward();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full mt-8 space-y-3'
      >
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile photo'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <Image
                    src='/avatar-fallback.svg'
                    alt='profile photo'
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray'>
                <FileInput
                  type='file'
                  accept='image/*'
                  placeholder='Upload a photo'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormDescription>
                Contact the admin if you want to change the email
              </FormDescription>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormDescription className='text-red-500'>
                Change your password to secure your account
              </FormDescription>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='!mt-10 flex justify-end'>
          <Button type='submit'>Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentAccountDetailForm;

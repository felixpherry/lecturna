'use client';

import * as z from 'zod';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserValidation } from '@/lib/validations/user';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { PasswordInput } from '../shared/PasswordInput';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Form {
  email: string;
  password: string;
}

const INITIAL_FORM = {
  email: '',
  password: '',
};

const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {
  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: INITIAL_FORM,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof UserValidation>) => {
    try {
      setIsLoading(true);

      const res = await signIn('credentials', {
        redirect: false,
        ...values,
      });

      if (res?.error !== null) {
        throw new Error(res?.error);
      }

      router.push('/dashboard');
      toast.success('Successfully logged in');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      form.reset();
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      const res = await signIn('google', {
        redirect: false,
        callbackUrl: '/dashboard',
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className={`grid gap-6 ${className}`} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-3'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='johndoe@example.com' {...field} />
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
                <FormControl>
                  <PasswordInput placeholder='**********' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant='primary-blue'
            className='text-sm w-full'
            disabled={isLoading || isGoogleLoading}
            type='submit'
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}{' '}
            Masuk
          </Button>
        </form>
      </Form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-white px-2 text-gray-100'>Atau</span>
        </div>
      </div>
      <Button
        variant='light'
        className='text-sm w-full'
        disabled={isLoading || isGoogleLoading}
        onClick={signInWithGoogle}
        type='submit'
      >
        {isGoogleLoading ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Image
            src='https://authjs.dev/img/providers/google.svg'
            alt='google'
            width={18}
            height={18}
            className='mr-2'
          />
        )}{' '}
        Masuk dengan Google
      </Button>
    </div>
  );
};

export default UserAuthForm;

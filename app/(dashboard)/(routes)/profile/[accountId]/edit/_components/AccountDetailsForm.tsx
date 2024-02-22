'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PhoneNumberValidation } from '@/lib/validations/phone-number';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Textarea } from '@mantine/core';
import { Account } from '@prisma/client';
import { Loader2, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { updateAccount } from '../_actions';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ProfileImageDropzone from './ProfileImageDropzone';
import Image from 'next/image';
import { isBase64DataURL } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';

const formSchema = z.object({
  email: z.string(),
  name: z.string(),
  username: z.string(),
  phoneNumber: PhoneNumberValidation,
  image: z.string(),
  address: z.string(),
});

interface AccountDetailsFormProps {
  initialData: Account;
}

const AccountDetailsForm = ({ initialData }: AccountDetailsFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing('profilePhoto');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData.email || '',
      name: initialData.name || '',
      address: initialData.address || '',
      image: initialData.image || '',
      phoneNumber: initialData.phoneNumber || '',
      username: initialData.username || '',
    },
  });

  const { isSubmitting } = form.formState;

  const pathname = usePathname()!;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        image: values.image,
        fileKey: initialData.fileKey || null,
        username: values.username,
        phoneNumber: values.phoneNumber,
        address: values.address,
      };

      if (isBase64DataURL(values.image)) {
        const res = await startUpload(files);
        if (!res || res.length === 0) throw new Error('Failed to upload image');
        const { key, url } = res[0];
        payload.fileKey = key;
        payload.image = url;
      }

      const { error, message } = await updateAccount({
        id: initialData.id,
        ...payload,
        pathname,
      });

      if (error !== null) throw new Error(message);
      toast.success(message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleResetImage = () => {
    setFiles([]);
    form.setValue('image', initialData.image || '');
  };

  const handleDeleteImage = () => {
    setFiles([]);
    form.setValue('image', '');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                {!field.value && !isSubmitting ? (
                  <ProfileImageDropzone
                    onFileChange={field.onChange}
                    value={field.value}
                    setFiles={setFiles}
                    handleResetImage={handleResetImage}
                  />
                ) : (
                  <div className='rounded-full shadow w-32 h-32 relative'>
                    <Image
                      src={field.value}
                      fill
                      alt='Profile Photo'
                      className='object-contain rounded-full'
                    />
                    <button
                      onClick={handleDeleteImage}
                      className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-0 shadow-sm'
                      type='button'
                      disabled={isSubmitting}
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                )}
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
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormDescription>
                You can&apos;t change email due to security reasons
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled />
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
          name='phoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end items-center'>
          <Button size='sm'>
            {isSubmitting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Save className='h-4 w-4' />
            )}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountDetailsForm;

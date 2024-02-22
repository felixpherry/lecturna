'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@mantine/core';
import { Hero } from '@prisma/client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import HeroImageDropzone from './HeroImageDropzone';
import { useState } from 'react';
import Image from 'next/image';
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64DataURL } from '@/lib/utils';
import { createOrUpdateHero } from '@/lib/actions/hero.actions';
import { usePathname } from 'next/navigation';

interface HeroFormProps {
  initialData: Hero | null;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
  subtitle: z.string().min(1, {
    message: 'Subtitle is required',
  }),
  image: z.string().min(1, {
    message: 'Image is required',
  }),
});

const HeroForm = ({ initialData }: HeroFormProps) => {
  const { startUpload } = useUploadThing('heroImage');

  const [files, setFiles] = useState<File[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: initialData?.image || '',
      title: initialData?.title || '',
      subtitle: initialData?.subtitle || '',
    },
  });

  const { isSubmitting } = form.formState;

  const pathname = usePathname()!;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const image: string = values.image;

      const payload = {
        title: values.title,
        subtitle: values.subtitle,
        image: '',
        fileKey: initialData?.fileKey || null,
      };
      if (isBase64DataURL(image)) {
        const res = await startUpload(files);

        if (!res || res.length === 0) {
          throw new Error('No files uploaded');
        }

        const { key, url } = res[0];
        payload.fileKey = key;
        payload.image = url;
      }

      const { error, message } = await createOrUpdateHero({
        payload,
        pathname,
      });

      if (error !== null) throw new Error(message);
      toast.success(message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteImage = () => {
    form.setValue('image', '');
    setFiles([]);
  };

  const handleResetImage = () => {
    form.setValue('image', initialData?.image || '');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full'>
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                {!field.value && !isSubmitting ? (
                  <HeroImageDropzone
                    onFileChange={field.onChange}
                    value={field.value}
                    setFiles={setFiles}
                    handleResetImage={handleResetImage}
                  />
                ) : (
                  <div className='rounded-md shadow max-w-xs relative'>
                    <Image
                      src={field.value}
                      width={800}
                      height={300}
                      alt='hero image'
                      className='h-fit w-full rounded-md'
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
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='subtitle'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-start'>
          <Button size='sm' disabled={isSubmitting}>
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

export default HeroForm;

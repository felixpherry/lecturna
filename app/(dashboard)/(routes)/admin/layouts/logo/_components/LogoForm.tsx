'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Logo } from '@prisma/client';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import Image from 'next/image';
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64DataURL } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { createOrUpdateLogo } from '@/lib/actions/logo.actions';
import LogoImageDropzone from './LogoImageDropzone';

interface LogoFormProps {
  initialData: Logo | null;
}

const formSchema = z.object({
  image: z.string().min(1, {
    message: 'Logo image is required',
  }),
});

const LogoForm = ({ initialData }: LogoFormProps) => {
  const { startUpload } = useUploadThing('logoImage');

  const [files, setFiles] = useState<File[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: initialData?.image || '',
    },
  });

  const { isSubmitting } = form.formState;

  const pathname = usePathname()!;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const image: string = values.image;

      const payload = {
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

      const { error, message } = await createOrUpdateLogo({
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
              <FormControl>
                {!field.value && !isSubmitting ? (
                  <LogoImageDropzone
                    onFileChange={field.onChange}
                    value={field.value}
                    setFiles={setFiles}
                    handleResetImage={handleResetImage}
                  />
                ) : (
                  <div className='rounded-full shadow h-32 w-32 relative'>
                    <Image
                      src={field.value}
                      width={800}
                      height={300}
                      alt='logo image'
                      className='h-full w-full rounded-full'
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

export default LogoForm;

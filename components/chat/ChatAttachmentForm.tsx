'use client';

import { useState } from 'react';
import ChatAttachmentDropzone from './ChatAttachmentDropzone';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { FileIcon, Loader2, SendHorizonal, X } from 'lucide-react';
import Image from 'next/image';
import FileSaver from 'file-saver';
import { useUploadThing } from '@/lib/uploadthing';
import qs from 'query-string';
import { toast } from 'sonner';
import { modals } from '@mantine/modals';

interface ChatAttachmentFormProps {
  apiUrl: string;
  query: Record<string, any>;
}

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: 'Attachment is required',
  }),
});

const ChatAttachmentForm = ({ apiUrl, query }: ChatAttachmentFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing('chatAttachment');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await startUpload(files);

      if (!res || res.length === 0) {
        throw new Error('No files uploaded');
      }

      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      });

      await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          fileKey: res[0].key,
          fileUrl: res[0].url,
          content: res[0].url,
        }),
      });

      form.reset();
      modals.closeAll();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteFile = () => {
    setFiles([]);
    form.setValue('fileUrl', '');
  };

  const handleSaveFile = () => {
    if (!files || files.length === 0) return;
    FileSaver.saveAs(files[0], files[0].name);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='fileUrl'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                  {!field.value && !isSubmitting && (
                    <ChatAttachmentDropzone
                      setFiles={setFiles}
                      onFileChange={field.onChange}
                      value={field.value}
                    />
                  )}

                  {field.value && field.value.includes('image') && (
                    <div className='rounded-md shadow max-w-xs relative text-center mt-5 mx-auto'>
                      <Image
                        src={field.value}
                        width={800}
                        height={300}
                        alt='hero image'
                        className='h-fit w-full rounded-md'
                      />
                      <button
                        onClick={handleDeleteFile}
                        className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-0 shadow-sm'
                        type='button'
                        disabled={isSubmitting}
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                  )}

                  {field.value && field.value.includes('application/pdf') && (
                    <div className='relative flex items-center p-2 mt-2 rounded-md bg-sky-200/20'>
                      <FileIcon className='h-10 w-10 fill-sky-200/20 stroke-primary-blue' />
                      <span
                        onClick={handleSaveFile}
                        className='ml-2 text-sm text-primary-blue hover:underline cursor-pointer'
                      >
                        {files[0]?.name || 'PDF File'}
                      </span>
                      <button
                        type='button'
                        className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shado-sm'
                        onClick={handleDeleteFile}
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                  )}
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='mt-3 flex itmes-center justify-end'>
          <Button size='sm' disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <SendHorizonal className='h-4 w-4' />
            )}
            Send
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChatAttachmentForm;

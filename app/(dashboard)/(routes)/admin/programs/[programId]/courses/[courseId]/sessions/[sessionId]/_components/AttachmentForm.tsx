'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64DataURL } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, Group, Input, Radio } from '@mantine/core';
import { modals } from '@mantine/modals';
import { Attachment } from '@prisma/client';
import FileSaver from 'file-saver';
import { FileIcon, Loader2, Save, X } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import AttachmentFileDropzone from './AttachmentFileDropzone';
import {
  AddCourseAttachmentParams,
  addCourseAttachment,
  editCourseAttachment,
} from '@/lib/actions/course.actions';

interface AttachmentFormProps {
  formType: 'ADD' | 'EDIT';
  initialData?: Attachment;
}

export type FileType = 'image' | 'pdf' | 'text' | 'audio' | 'video';

const formSchema = z.object({
  filename: z.string().min(1, {
    message: 'Filename is required',
  }),
  fileType: z
    .string({
      required_error: 'File type is required',
    })
    .min(1, {
      message: 'File type is required',
    }),
  fileUrl: z
    .string({
      required_error: 'File is required',
    })
    .min(1, {
      message: 'File is required',
    }),
});

const AttachmentForm = ({ formType, initialData }: AttachmentFormProps) => {
  const { startUpload } = useUploadThing('courseAttachment');

  const [files, setFiles] = useState<File[]>([]);
  const [isEditingFile, setIsEditingFile] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filename: initialData?.filename || '',
      fileUrl: initialData?.fileUrl || '',
      fileType: initialData?.fileType || '',
    },
  });

  const { isSubmitting } = form.formState;

  const pathname = usePathname()!;
  const params = useParams()!;

  const sessionId: string = params.sessionId as string;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const fileUrl: string = values.fileUrl;
      const payload: AddCourseAttachmentParams['payload'] = {
        fileUrl: values.fileUrl,
        filename: values.filename,
        fileType: values.fileType,
        sessionId,
      };
      if (isBase64DataURL(fileUrl)) {
        const res = await startUpload(files);

        if (!res || res.length === 0) {
          throw new Error('No files uploaded');
        }

        const { key, url } = res[0];

        payload['fileKey'] = key;
        payload['fileUrl'] = url;
      } else {
        if (formType === 'EDIT' && values.fileUrl !== initialData?.fileUrl) {
          payload['fileKey'] = null;
        }
      }
      if (formType === 'ADD')
        await addCourseAttachment({ sessionId, pathname, payload });
      else
        await editCourseAttachment({
          prevData: initialData!,
          newData: payload,
          pathname: pathname,
        });

      toast.success(
        `Successfully ${formType === 'ADD' ? 'added' : 'updated'} attachment`
      );
      modals.closeAll();
    } catch (error: any) {
      toast.error(
        `Failed to ${formType === 'ADD' ? 'add' : 'update'} attachment`
      );
    }
  };

  const handleDeleteFile = () => {
    setFiles([]);
    form.setValue('fileUrl', '');
    setIsEditingFile(true);
  };

  const handlePreview = () => {
    const fileUrl = form.getValues('fileUrl');
    if (!isBase64DataURL(fileUrl)) return window.open(fileUrl);

    FileSaver.saveAs(files[0], files[0].name);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='filename'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filename</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='fileType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Type</FormLabel>
              <FormControl>
                <Radio.Group {...field}>
                  <Group mt='xs'>
                    <Radio icon={CheckIcon} value='image' label='Image' />
                    <Radio icon={CheckIcon} value='pdf' label='PDF' />
                    <Radio icon={CheckIcon} value='text' label='Text' />
                    <Radio icon={CheckIcon} value='video' label='Video' />
                    <Radio icon={CheckIcon} value='audio' label='Audio' />
                  </Group>
                </Radio.Group>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!!form.watch('fileType') && (
          <FormField
            control={form.control}
            name='fileUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  {isEditingFile ? (
                    <AttachmentFileDropzone
                      type={form.getValues('fileType') as FileType}
                      setIsEditingFile={setIsEditingFile}
                      onFileChange={field.onChange}
                      setFiles={setFiles}
                      value={field.value}
                    />
                  ) : (
                    <div className='relative flex items-center p-2 mt-2 rounded-md bg-slate-200'>
                      <FileIcon className='h-8 w-8 fill-sky-200/20 stroke-primary-blue' />
                      <span
                        onClick={handlePreview}
                        className='ml-2 text-sm text-primary-blue hover:underline cursor-pointer'
                      >
                        {files.length > 0 ? files[0].name : field.value}
                      </span>
                      <button
                        onClick={handleDeleteFile}
                        className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-0 shadow-sm'
                        type='button'
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
        )}

        <div className='w-full flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => modals.closeAll()}
          >
            Close
          </Button>
          <Button type='submit' size='sm'>
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

export default AttachmentForm;

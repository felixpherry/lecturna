'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { CourseEvaluation } from '@prisma/client';
import { toast } from 'sonner';
import { Checkbox, Input, NumberInput, Textarea } from '@mantine/core';
import {
  addNewEvaluation,
  updateCourseEvaluation,
} from '@/lib/actions/course.actions';
import { modals } from '@mantine/modals';
import ConfirmForm from '@/components/modals/ConfirmForm';

interface CourseEvaluationsFormProps {
  type: 'ADD' | 'EDIT';
  initialData?: CourseEvaluation;
  closeForm: () => void;
  hasSessionReportEvaluation: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Evaluation name is required',
  }),
  weight: z.coerce
    .number()
    .min(0, {
      message: 'Weight should be a positive number',
    })
    .max(100, {
      message: 'Weight should not be greater than 100',
    }),
  description: z.string().min(1, {
    message: 'Description is required',
  }),
  isSessionReport: z.boolean(),
});

const EvaluationForm = ({
  initialData,
  type,
  closeForm,
  hasSessionReportEvaluation,
}: CourseEvaluationsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || '',
      isSessionReport: initialData?.isSessionReport || false,
      name: initialData?.name || '',
      weight: initialData?.weight,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const pathname = usePathname()!;
  const params = useParams()!;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const handleSave = async () => {
      try {
        if (type === 'ADD') {
          const { error, message } = await addNewEvaluation({
            courseId: params.courseId as string,
            newEvaluation: {
              courseId: params.courseId as string,
              ...values,
            },
            pathname,
          });

          if (error !== null) throw new Error(error);
          toast.success(message);
        } else if (type === 'EDIT') {
          if (!initialData?.id) throw new Error('Evaluation ID is missing');

          const { error, message } = await updateCourseEvaluation({
            courseId: params.courseId as string,
            evaluationId: initialData?.id,
            newEvaluation: {
              courseId: params.courseId as string,
              ...values,
            },
            pathname,
          });
          if (error !== null) throw new Error(error);
          toast.success(message);
        }
        closeForm();
        form.reset();
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    if (hasSessionReportEvaluation && values.isSessionReport) {
      modals.open({
        title: (
          <p className='text-primary font-semibold text-xl'>Are you sure?</p>
        ),
        children: (
          <ConfirmForm
            description='Do you want to replace the existing evaluation for the session report with this one instead??'
            onConfirm={handleSave}
          />
        ),
      });
    } else {
      await handleSave();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Name' disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='weight'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <NumberInput
                  placeholder='Weight'
                  hideControls
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder='Description'
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='isSessionReport'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  label='Session Report'
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size='sm' disabled={isSubmitting} type='submit'>
          {isSubmitting ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <Save className='w-4 h-4' />
          )}
          Save
        </Button>
      </form>
    </Form>
  );
};

export default EvaluationForm;

import { ColorInput, Input, NumberInput, Textarea } from '@mantine/core';
import { MasterGrade } from '@prisma/client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { modals } from '@mantine/modals';
import { addNewGradeCategory, updateGradeCategory } from '../_actions';

interface GradeFormProps {
  type: 'ADD' | 'EDIT';
  initialData?: MasterGrade;
}

const formSchema = z.object({
  category: z.string().min(1, {
    message: 'Category is required',
  }),
  minScore: z
    .number()
    .min(0, {
      message: 'Minimum score must be greater than or equal to zero',
    })
    .max(100, {
      message: 'Maximum score must be less than or equal to 100',
    }),
  maxScore: z
    .number()
    .min(0, {
      message: 'Maximum score must be greater than or equal to zero',
    })
    .max(100, {
      message: 'Maximum score must be less than or equal to 100',
    }),
  description: z.string().min(1, {
    message: 'Description should not be empty',
  }),
  hexCode: z.string().min(1, {
    message: 'Hex code should not be empty',
  }),
});

const GradeForm = ({ type, initialData }: GradeFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: initialData?.category || '',
      description: initialData?.description || '',
      minScore: initialData?.minScore,
      maxScore: initialData?.maxScore,
      hexCode: initialData?.hexCode || '',
    },
  });

  const { isSubmitting } = form.formState;

  const pathname = usePathname()!;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (type === 'ADD') {
        const { error, message } = await addNewGradeCategory({
          payload: values,
          pathname,
        });

        if (error !== null) throw new Error(message);
        toast.success(message);
      } else {
        const { error, message } = await updateGradeCategory({
          id: initialData?.id!,
          payload: values,
          pathname,
        });

        if (error !== null) throw new Error(message);
        toast.success(message);
      }

      modals.closeAll();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='minScore'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Min Score</FormLabel>
              <FormControl>
                <NumberInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='maxScore'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Score</FormLabel>
              <FormControl>
                <NumberInput {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='hexCode'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <ColorInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='pt-3 w-full flex justify-end'>
          <Button disabled={isSubmitting} type='submit' size='sm'>
            {isSubmitting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Save className='h-4 w-4' />
            )}{' '}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GradeForm;

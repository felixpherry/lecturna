import { Input } from '@mantine/core';
import { Category } from '@prisma/client';
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
import { addNewCategory, updateCategory } from '@/lib/actions/category.actions';

interface CategoryFormProps {
  type: 'ADD' | 'EDIT';
  initialData?: Category;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Category name is required',
  }),
  ageDescription: z.string().min(1, {
    message: 'Age description is required',
  }),
});

const CategoryForm = ({ type, initialData }: CategoryFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      ageDescription: initialData?.ageDescription || '',
    },
  });

  const { isSubmitting } = form.formState;

  const pathname = usePathname()!;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (type === 'ADD') {
        const { error, message } = await addNewCategory({
          payload: values,
          pathname,
        });

        if (error !== null) throw new Error(message);
        toast.success(message);
      } else {
        const { error, message } = await updateCategory({
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
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='ageDescription'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Description</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <Save className='w-4 h-4' />
            )}{' '}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;

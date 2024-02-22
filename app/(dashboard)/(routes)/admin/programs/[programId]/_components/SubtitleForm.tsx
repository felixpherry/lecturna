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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, Save } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Program } from '@prisma/client';
import { updateProgram } from '@/lib/actions/program.actions';
import { toast } from 'sonner';

interface SubtitleFormProps {
  initialData: Program;
}

const formSchema = z.object({
  subtitle: z.string().min(1, {
    message: 'Subtitle is required',
  }),
});

const SubtitleForm = ({ initialData }: SubtitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subtitle: initialData.subtitle || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const pathname = usePathname()!;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error, message } = await updateProgram({
        id: initialData.id,
        payload: { subtitle: values.subtitle },
        pathname,
      });

      if (error !== null) throw new Error(message);
      toast.success(message);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Subtitle
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit Subtitle
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='subtitle'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='For Age 13-16'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button
                size='sm'
                disabled={!isValid || isSubmitting}
                type='submit'
              >
                {isSubmitting ? (
                  <Loader2 className=' w-4 h-4 animate-spin' />
                ) : (
                  <Save className='w-4 h-4' />
                )}
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <>
          <p className='text-sm mt-2'>{initialData.subtitle}</p>
        </>
      )}
    </div>
  );
};

export default SubtitleForm;

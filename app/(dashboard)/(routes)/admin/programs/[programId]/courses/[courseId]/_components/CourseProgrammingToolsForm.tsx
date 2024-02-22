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
import { Loader2, Pencil, Save } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Course } from '@prisma/client';
import { updateCourse } from '@/lib/actions/program.actions';
import Editor from '@/components/shared/Editor';
import { cn } from '@/lib/utils';
import Preview from '@/components/shared/Preview';
import { toast } from 'sonner';

interface CourseProgrammingToolsFormProps {
  initialData: Course;
}

const formSchema = z.object({
  programmingTools: z.string().min(1, {
    message: 'Programming Tools is required',
  }),
});

const CourseProgrammingToolsForm = ({
  initialData,
}: CourseProgrammingToolsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programmingTools: initialData.programmingTools || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const pathname = usePathname()!;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error, message } = await updateCourse({
        id: initialData.id,
        payload: {
          programmingTools: values.programmingTools,
          programId: initialData.programId,
        },
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
        Programming Tools
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit Programming Tools
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
              name='programmingTools'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
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
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Save className='h-4 w-4' />
                )}
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.programmingTools && 'text-slate-500 italic'
          )}
        >
          {!initialData.programmingTools ? (
            'No programmingTools'
          ) : (
            <Preview value={initialData.programmingTools} />
          )}
        </div>
      )}
    </div>
  );
};

export default CourseProgrammingToolsForm;

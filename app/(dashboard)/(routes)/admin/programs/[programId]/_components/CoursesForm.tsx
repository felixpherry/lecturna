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
import { List, Loader2, Pencil, PlusCircle, Save } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Program, Course } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { addCourse } from '@/lib/actions/program.actions';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';

interface CoursesFormProps {
  initialData: {
    courses: Course[];
  } & Program;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Chapter is required',
  }),
});

const CoursesForm = ({ initialData }: CoursesFormProps) => {
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreating = () => setIsCreating((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const pathname = usePathname()!;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error, message } = await addCourse({
        name: values.name,
        programId: initialData.id,
        pathname,
      });

      if (error !== null) throw new Error(message);
      toast.success(message);
      toggleCreating();
      form.reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Courses
        <Button onClick={toggleCreating} variant='ghost'>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a new course
            </>
          )}
        </Button>
      </div>
      {isCreating ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='JavaScript for beginners'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size='sm' disabled={!isValid || isSubmitting} type='submit'>
              {isSubmitting ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Save className='w-4 h-4' />
              )}
              Save
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <div
            className={cn(
              'text-sm mt-2',
              !initialData.courses.length && 'text-slate-500 italic'
            )}
          >
            {!initialData.courses.length && 'No courses'}

            <div>
              {initialData.courses.map((course) => (
                <div key={course.id}>
                  <div
                    className={cn(
                      'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
                      course.isPublished &&
                        'bg-sky-100 border-sky-200 text-sky-700'
                    )}
                  >
                    <div
                      className={cn(
                        'px-2 py-3 border-r border-r-slate-200 rounded-l-md transition',
                        course.isPublished &&
                          'border-r-sky-200 hover:bg-sky-200'
                      )}
                    >
                      <List className='h-5 w-5' />
                    </div>
                    {course.name}
                    <div className='ml-auto pr-2 flex items-center gap-x-2'>
                      <Badge
                        className={cn(
                          'bg-slate-500',
                          course.isPublished && 'bg-sky-700'
                        )}
                      >
                        {course.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Link
                        href={`/admin/programs/${initialData.id}/courses/${course.id}`}
                      >
                        <Pencil className='w-4 h-4 cursor-pointer hover:opacity-75 transition' />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoursesForm;

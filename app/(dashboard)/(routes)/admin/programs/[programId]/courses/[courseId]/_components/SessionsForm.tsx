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
import { Loader2, PlusCircle, Save } from 'lucide-react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';
import { Session, Course } from '@prisma/client';
import { addSession, reorderSessions } from '@/lib/actions/program.actions';
import SessionsList from './SessionsList';
import { toast } from 'sonner';

interface SessionsFormProps {
  initialData: {
    sessions: Session[];
  } & Course;
}

const formSchema = z.object({
  main: z.string().min(1, {
    message: 'Session is required',
  }),
});

const SessionsForm = ({ initialData }: SessionsFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();
  const toggleCreating = () => setIsCreating((prev) => !prev);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      main: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const pathname = usePathname()!;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error, message } = await addSession({
        main: values.main,
        courseId: initialData.id,
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

  const onReorder = async (
    updateData: { id: string; sessionNumber: number }[]
  ) => {
    try {
      setIsUpdating(true);
      await reorderSessions({
        updateData,
        pathname,
      });
      toast.success('Successfully reordered sessions');
    } catch (error: any) {
      toast.error('Failed to reorder sessions');
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(
      `/admin/programs/${initialData.programId}/courses/${initialData.id}/sessions/${id}`
    );
  };

  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
      {isUpdating && (
        <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center cursor-wait'>
          <Loader2 className='animate-spin h-6 w-6 text-sky-700' />
        </div>
      )}
      <div className='font-medium flex items-center justify-between'>
        Sessions
        <Button onClick={toggleCreating} variant='ghost'>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a new session
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
              name='main'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='Getting Started'
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
              !initialData.sessions.length && 'text-slate-500 italic'
            )}
          >
            {!initialData.sessions.length && 'No sessions'}
            <SessionsList
              onEdit={onEdit}
              onReorder={onReorder}
              items={initialData.sessions || []}
            />
          </div>
          <p className='text-xs text-muted-foreground mt-4'>
            Drag and drop to reorder the sessions
          </p>
        </>
      )}
    </div>
  );
};

export default SessionsForm;

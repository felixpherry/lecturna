'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { usePathname, useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { SessionInterface } from '@/types';
import { ArrowRight, Loader2 } from 'lucide-react';
import { createProgram } from '@/lib/actions/program.actions';
import { toast } from 'sonner';

interface CreateProgramFormProps {
  session: SessionInterface;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Program name is required',
  }),
});

const CreateProgramForm = ({ session }: CreateProgramFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const pathname = usePathname()!;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error, message } = await createProgram({
        name: values.name,
        accountId: session.user.id,
        pathname,
      });

      if (error !== null) throw new Error(message);
      toast.success(message);
      router.push(`/admin/programs/${data.id}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className='w-fit mx-auto flex md:items-center md:justify-center min-h-[calc(100vh-120px)]'>
      <div className='p-6 bg-white shadow rounded-md'>
        <h1 className='text-2xl font-semibold'>Create Program</h1>
        <p className='text-sm text-slate-600'>
          What would you like to name the program? Program name can be changed
          later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 mt-8'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='Web Programming'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button variant='ghost' asChild>
                <Link href='/admin/programs'>Cancel</Link>
              </Button>
              <Button type='submit' disabled={!isValid || isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <ArrowRight className='h-4 w-4' />
                )}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateProgramForm;

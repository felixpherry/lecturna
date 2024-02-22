'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Course } from '@prisma/client';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { registerTrialClass } from '../_actions';
import { toast } from 'sonner';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { TrialClassValidation } from '@/lib/validations/trial-class';
import { DateInput, DateTimePicker } from '@mantine/dates';
import { MantineSelectOption } from '@/types';
import { Select } from '@mantine/core';

const TrialClassRegistrationForm = ({ courses }: { courses: Course[] }) => {
  const form = useForm<z.infer<typeof TrialClassValidation>>({
    resolver: zodResolver(TrialClassValidation),
    defaultValues: {
      birthPlace: '',
      childName: '',
      dateOfBirth: new Date(),
      email: '',
      parentName: '',
      phoneNumber: '',
      trialClassDate: new Date(),
      courseId: '',
    },
  });
  const pathname = usePathname()!;
  const router = useRouter();

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof TrialClassValidation>) => {
    try {
      const { error, message } = await registerTrialClass({
        payload: values,
        pathname,
      });
      if (error !== null) throw new Error(message);
      toast.success(message);

      form.reset();

      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const courseOptions: MantineSelectOption[] = courses.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  return (
    <div className='container max-w-3xl py-28'>
      <Card className='p-5 pt-14 shadow-xl'>
        <CardTitle className='text-center font-bold text-3xl font-josefin mb-20'>
          Daftar Trial Class
        </CardTitle>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
              <FormField
                control={form.control}
                name='courseId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pilih Kursus</FormLabel>
                    <FormControl>
                      <Select data={courseOptions} {...field} searchable />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='childName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Anak</FormLabel>
                    <FormDescription>
                      Nama lengkap sesuai akta lahir
                    </FormDescription>
                    <FormControl>
                      <Input disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='birthPlace'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempat Lahir</FormLabel>
                    <FormControl>
                      <Input disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <DateInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='parentName'
                render={({ field }) => (
                  <FormItem className='bg-white'>
                    <FormLabel>Nama Orang Tua</FormLabel>
                    <FormControl>
                      <Input disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='bg-white'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem className='bg-white'>
                    <FormLabel>No. HP</FormLabel>
                    <FormDescription>
                      Gunakan nomor yang terdaftar di Whatsapp
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder='No. HP diawali dengan angka 0'
                        type='number'
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
                name='trialClassDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pilihan Hari Trial Class</FormLabel>
                    <FormControl>
                      <DateTimePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='!mt-10'>
                <Button size='sm' type='submit'>
                  {isSubmitting ? (
                    <Loader2 className='animate-spin h-4 w-4' />
                  ) : (
                    <ArrowRight className='h-4 w-4' />
                  )}
                  Daftar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialClassRegistrationForm;

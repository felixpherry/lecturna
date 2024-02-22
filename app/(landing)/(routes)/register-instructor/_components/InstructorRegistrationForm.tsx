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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, MultiSelect, Select } from '@mantine/core';
import { Skill } from '@prisma/client';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { registerInstructor } from '../_actions';
import { toast } from 'sonner';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { DateInput } from '@mantine/dates';
import { lastEducations } from '@/constants';
import { PhoneNumberValidationIDN } from '@/lib/validations/phone-number';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Nama wajib diisi',
  }),
  dateOfBirth: z.coerce.date({
    required_error: 'Tanggal lahir wajib diisi',
  }),
  lastEducation: z.enum(['SMA', 'S1', 'S2', 'S3'], {
    required_error: 'Pendidikan terakhir wajib dipilih',
  }),
  educationInstitution: z.string().min(1, {
    message: 'Institusi pendidikan wajib diisi',
  }),
  email: z.string().email({
    message: 'Masukkan email yang valid',
  }),
  phoneNumber: PhoneNumberValidationIDN,
  address: z.string().min(1, {
    message: 'Alamat wajib diisi',
  }),
  skills: z.string().array().min(1, {
    message: 'Skill wajib diisi',
  }),
});

const InstructorRegistrationForm = ({ skills }: { skills: Skill[] }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      dateOfBirth: new Date(),
      educationInstitution: '',
      lastEducation: undefined,
      phoneNumber: '',
      skills: [],
    },
  });
  const pathname = usePathname()!;
  const router = useRouter();

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error, message } = await registerInstructor({
        payload: {
          data: {
            address: values.address,
            dateOfBirth: values.dateOfBirth,
            educationInstitution: values.educationInstitution,
            email: values.email,
            lastEducation: values.lastEducation,
            name: values.name,
            phoneNumber: values.phoneNumber,
          },
          skills: Array.from(values.skills),
        },
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

  const skillOptions = skills.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  return (
    <div className='container max-w-2xl py-28'>
      <Card className='p-5 pt-14 shadow-xl'>
        <CardTitle className='text-center font-bold text-3xl font-josefin mb-20'>
          Daftar sebagai Instruktur
        </CardTitle>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormDescription>Nama lengkap sesuai KTP</FormDescription>
                    <FormControl>
                      <Input disabled={isSubmitting} autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
                    <FormLabel>No. HP</FormLabel>
                    <FormControl>
                      <Input type='number' disabled={isSubmitting} {...field} />
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
                      <DateInput
                        valueFormat='DD-MM-YYYY'
                        clearable
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastEducation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pendidikan Terakhir</FormLabel>
                    <FormControl>
                      <Select
                        placeholder='Pilih'
                        data={lastEducations}
                        searchable
                        clearable
                        checkIconPosition='right'
                        nothingFoundMessage='Pencarian tidak ditemukan.'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='educationInstitution'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institusi Pendidikan</FormLabel>
                    <FormControl>
                      <Input disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='skills'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill</FormLabel>
                    <FormControl>
                      <MultiSelect
                        data={skillOptions}
                        searchable
                        clearable
                        checkIconPosition='right'
                        nothingFoundMessage='Pencarian tidak ditemukan'
                        {...field}
                      />
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

export default InstructorRegistrationForm;

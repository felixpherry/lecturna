'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select } from '@mantine/core';
import { Gender, Student } from '@prisma/client';
import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { usePathname } from 'next/navigation';
import { MantineSelectOption } from '@/types';
import { DateInput } from '@mantine/dates';
import { updateStudentInfo } from '../_actions';

const formSchema = z.object({
  studentId: z.string(),
  birthPlace: z.string().min(1, {
    message: 'Birth place is required',
  }),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
  gender: z.enum(['MALE', 'FEMALE']),
  gradeClass: z.string().min(1, {
    message: 'Grade class is required',
  }),
  educationInstitution: z.string().min(1, {
    message: 'Education institution is required',
  }),
  hobby: z.string(),
  ambition: z.string(),
});

interface StudentInformationFormProps {
  initialData: Student;
}

const StudentInformationForm = ({
  initialData,
}: StudentInformationFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: initialData.studentId,
      dateOfBirth: initialData.dateOfBirth,
      educationInstitution: initialData.educationInstitution,
      gender: initialData.gender,
      gradeClass: initialData.gradeClass,
      hobby: initialData.hobby || '',
      ambition: initialData.ambition || '',
      birthPlace: initialData.birthPlace,
    },
  });

  const genderOptions: MantineSelectOption[] = [
    {
      label: 'Male',
      value: Gender.MALE,
    },
    {
      label: 'Female',
      value: Gender.FEMALE,
    },
  ];

  const { isSubmitting } = form.formState;

  const pathname = usePathname()!;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error, message } = await updateStudentInfo({
        ...values,
        id: initialData.id,
        pathname,
      });

      if (error !== null) throw new Error(message);
      toast.success(message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='studentId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='gender'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Select
                  data={genderOptions}
                  checkIconPosition='right'
                  {...field}
                />
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
              <FormLabel>Birth Place</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <DateInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='gradeClass'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade Class</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Education Institution</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='hobby'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hobby</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='ambition'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ambition</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end items-center'>
          <Button size='sm'>
            {isSubmitting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Save className='h-4 w-4' />
            )}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentInformationForm;

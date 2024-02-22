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
import { Input, MultiSelect, Select } from '@mantine/core';
import { Instructor, LastEducation, Skill } from '@prisma/client';
import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { usePathname } from 'next/navigation';
import { DateInput } from '@mantine/dates';
import { lastEducations } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { fetchSkills, updateInstructorInfo } from '../_actions';
import { MantineSelectOption } from '@/types';

const formSchema = z.object({
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
  lastEducation: z.enum(['SMA', 'S1', 'S2', 'S3'], {
    required_error: 'Last Education is required',
  }),
  educationInstitution: z.string().min(1, {
    message: 'Education institution is required',
  }),
  skills: z.string().array().min(1, {
    message: 'Skill is required',
  }),
});

interface InstructorInformationFormProps {
  initialData: Instructor & {
    skills: Skill[];
  };
}

const InstructorInformationForm = ({
  initialData,
}: InstructorInformationFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateOfBirth: initialData.dateOfBirth,
      educationInstitution: initialData.educationInstitution,
      lastEducation: initialData.lastEducation as LastEducation,
      skills: initialData.skills.map((skill) => skill.id),
    },
  });

  const { isSubmitting } = form.formState;

  const pathname = usePathname()!;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error, message } = await updateInstructorInfo({
        id: initialData.id,
        dateOfBirth: values.dateOfBirth,
        educationInstitution: values.educationInstitution,
        lastEducation: values.lastEducation,
        skillIds: values.skills,
        pathname,
      });

      if (error !== null) throw new Error(message);
      toast.success(message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const { data: skills } = useQuery({
    queryKey: ['skills'],
    queryFn: () => fetchSkills(),
  });

  const skillOptions: MantineSelectOption[] =
    skills?.map((skill) => ({
      label: skill.name,
      value: skill.id,
    })) || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
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
          name='lastEducation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Education</FormLabel>
              <FormControl>
                <Select
                  placeholder='Choose'
                  data={lastEducations}
                  clearable
                  checkIconPosition='right'
                  nothingFoundMessage='Could not find education'
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
                  nothingFoundMessage='Could not find skill'
                  {...field}
                />
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

export default InstructorInformationForm;

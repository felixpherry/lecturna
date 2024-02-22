'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileInput, Input, MultiSelect, Select, Textarea } from '@mantine/core';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { LastEducation, Skill } from '@prisma/client';
import { DateInput } from '@mantine/dates';
import { PhoneNumberValidation } from '@/lib/validations/phone-number';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  phoneNumber: PhoneNumberValidation,
  address: z.string().min(1, {
    message: 'Address is required',
  }),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
  lastEducation: z.string().min(1, {
    message: 'Last education is required',
  }),
  educationInstitution: z.string().min(1, {
    message: 'Education insitution is required',
  }),
  skills: z.string().array().min(1, {
    message: 'Skill is required',
  }),
  fileIDCard: z.string().min(1, {
    message: 'ID card is required',
  }),
  fileNPWP: z.string().min(1, {
    message: 'NPWP is required',
  }),
});

export interface InstructorPersonalInfo {
  name: string;
  phoneNumber: string | null;
  address: string | null;
  dateOfBirth: Date;
  lastEducation: string;
  educationInstitution: string;
  skills: string[];
  fileIDCard: string;
  fileNPWP: string;
}

interface InstructorPersonalInfoFormProps {
  setActive: (active: number) => void;
  instructorPersonalInfo: InstructorPersonalInfo;
  setInstructorPersonalInfo: (
    newInstructorPersonalInfo: InstructorPersonalInfo
  ) => void;
  skills: Skill[];
  fileIDCard: File[];
  setFileIDCard: (file: File[]) => void;
  fileNPWP: File[];
  setFileNPWP: (file: File[]) => void;
}

const InstructorPersonalInfoForm = ({
  instructorPersonalInfo,
  setInstructorPersonalInfo,
  setActive,
  skills,
  fileIDCard,
  fileNPWP,
  setFileIDCard,
  setFileNPWP,
}: InstructorPersonalInfoFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: instructorPersonalInfo.name || '',
      phoneNumber: instructorPersonalInfo.phoneNumber || '',
      address: instructorPersonalInfo.address || '',
      dateOfBirth: instructorPersonalInfo.dateOfBirth,
      lastEducation: instructorPersonalInfo.lastEducation || '',
      educationInstitution: instructorPersonalInfo.educationInstitution || '',
      skills: instructorPersonalInfo.skills,
      fileIDCard: instructorPersonalInfo.fileIDCard || '',
      fileNPWP: instructorPersonalInfo.fileNPWP || '',
    },
  });

  const { isSubmitting } = form.formState;

  const handleImage = (
    file: File | null,
    fieldChange: (value: string) => void,
    name: 'fileNPWP' | 'fileIDCard'
  ) => {
    if (!file) return;

    const fileReader = new FileReader();

    if (!file.type.includes('image')) return;

    if (name === 'fileNPWP') setFileNPWP([file]);
    else setFileIDCard([file]);

    fileReader.onload = async (event) => {
      const imageDataUrl = event.target?.result?.toString() || '';

      fieldChange(imageDataUrl);
    };

    fileReader.readAsDataURL(file);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setInstructorPersonalInfo(values);
    setActive(2);
  };

  const skillOptions = skills.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const handleStepBack = () => {
    setActive(0);
  };

  const lastEducationOptions: LastEducation[] = ['SMA', 'S1', 'S2', 'S3'];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full mt-8 space-y-3'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <DateInput clearable valueFormat='DD-MM-YYYY' {...field} />
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type='number' disabled={isSubmitting} {...field} />
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
                  data={lastEducationOptions}
                  checkIconPosition='right'
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
          name='educationInstitution'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education Institution</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} {...field} />
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea disabled={isSubmitting} {...field} />
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
              <FormLabel>Skills</FormLabel>
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

        <FormField
          control={form.control}
          name='fileIDCard'
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Card</FormLabel>
              <FormControl>
                <FileInput
                  accept='image/*'
                  onChange={(e) => handleImage(e, field.onChange, field.name)}
                  value={fileIDCard[0]}
                />
              </FormControl>
              {field.value && (
                <Image
                  src={field.value}
                  alt='profile photo'
                  width={200}
                  height={200}
                  priority
                  className='!mt-3 h-40 w-fit'
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='fileNPWP'
          render={({ field }) => (
            <FormItem>
              <FormLabel>NPWP</FormLabel>
              <FormControl>
                <FileInput
                  accept='image/*'
                  onChange={(e) => handleImage(e, field.onChange, field.name)}
                  value={fileNPWP[0]}
                />
              </FormControl>
              {field.value && (
                <Image
                  src={field.value}
                  alt='profile photo'
                  width={200}
                  height={200}
                  priority
                  className='!mt-3 h-40 w-fit'
                />
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='!mt-10 flex justify-between'>
          <Button type='button' variant='outline' onClick={handleStepBack}>
            Back
          </Button>
          <Button type='submit'>
            {isSubmitting && <Loader2 className='animate-spin mr-2 h-4 w-4' />}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InstructorPersonalInfoForm;

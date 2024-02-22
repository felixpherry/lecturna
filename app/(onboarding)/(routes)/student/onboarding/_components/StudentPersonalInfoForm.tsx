'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select, Textarea } from '@mantine/core';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { DateInput } from '@mantine/dates';
import { PhoneNumberValidation } from '@/lib/validations/phone-number';
import { useStudentOnboardingStore } from '../_stores/use-student-onboarding-store';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  gender: z.enum(['MALE', 'FEMALE'], {
    required_error: 'Gender is required',
  }),
  phoneNumber: PhoneNumberValidation,
  address: z.string().min(1, {
    message: 'Address is required',
  }),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
  birthPlace: z.string().min(1, {
    message: 'Birth place is required',
  }),
  gradeClass: z.string().min(1, {
    message: 'Grade class is required',
  }),
  educationInstitution: z.string().min(1, {
    message: 'Education insitution is required',
  }),
  hobby: z.string(),
  ambition: z.string(),
});

const genderOptions = [
  {
    label: 'Male',
    value: 'MALE',
  },
  {
    label: 'Female',
    value: 'FEMALE',
  },
];

const StudentPersonalInfoForm = () => {
  const personalInfo = useStudentOnboardingStore((state) => state.personalInfo);
  const setPersonalInfo = useStudentOnboardingStore(
    (state) => state.setPersonalInfo
  );
  const stepBack = useStudentOnboardingStore((state) => state.stepBack);
  const stepForward = useStudentOnboardingStore((state) => state.stepForward);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: personalInfo.name,
      gender: personalInfo.gender || undefined,
      phoneNumber: personalInfo.phoneNumber,
      address: personalInfo.address,
      dateOfBirth: personalInfo.dateOfBirth,
      gradeClass: personalInfo.gradeClass,
      educationInstitution: personalInfo.educationInstitution,
      ambition: personalInfo.ambition,
      birthPlace: personalInfo.birthPlace,
      hobby: personalInfo.hobby,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setPersonalInfo(values);
    stepForward();
  };

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
          name='gender'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Select
                  data={genderOptions}
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
          name='birthPlace'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Place</FormLabel>
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
          name='gradeClass'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade Class</FormLabel>
              <FormControl>
                <Input type='number' disabled={isSubmitting} {...field} />
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
          name='hobby'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hobby</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} {...field} />
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
              <FormDescription>
                What do you want to be in the future?
              </FormDescription>
              <FormControl>
                <Input disabled={isSubmitting} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='!mt-10 flex justify-between'>
          <Button type='button' variant='outline' onClick={stepBack}>
            Back
          </Button>
          <Button type='submit'>Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentPersonalInfoForm;

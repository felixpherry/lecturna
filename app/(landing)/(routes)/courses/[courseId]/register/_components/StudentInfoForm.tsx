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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateInput } from '@mantine/dates';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const studentInfoSchema = z.object({
  childName: z.string().min(1, {
    message: 'Nama anak wajib diisi',
  }),
  childEmail: z.string().email({
    message: 'Email anak wajib diisi',
  }),
  dateOfBirth: z.coerce.date({
    required_error: 'Tanggal lahir anak wajib diisi',
  }),
  birthPlace: z.string().min(1, {
    message: 'Tempat lahir anak wajib diisi',
  }),
  childGender: z.enum(['MALE', 'FEMALE'], {
    required_error: 'Jenis kelamin wajib diisi',
  }),
  educationInstitution: z.string().min(1, {
    message: 'Asal sekolah wajib diisi',
  }),
  gradeClass: z.string().min(1, {
    message: 'Kelas wajib diisi',
  }),
});

interface StudentInfoFormProps {
  currentStep: number;
  setCurrentStep: (newStep: number) => void;
  initialStudentInfo: z.infer<typeof studentInfoSchema>;
  setStudentInfo: (newStudentInfo: z.infer<typeof studentInfoSchema>) => void;
}

const StudentInfoForm = ({
  currentStep,
  setCurrentStep,
  setStudentInfo,
  initialStudentInfo,
}: StudentInfoFormProps) => {
  const studentInfo = useForm<z.infer<typeof studentInfoSchema>>({
    resolver: zodResolver(studentInfoSchema),
    defaultValues: {
      ...initialStudentInfo,
    },
  });

  const { isSubmitting } = studentInfo.formState;

  const onSubmit = async (values: z.infer<typeof studentInfoSchema>) => {
    setCurrentStep(currentStep + 1);
    setStudentInfo(values);
  };
  return (
    <>
      <h2 className='text-3xl font-bold'>Data Calon Siswa</h2>

      <Form {...studentInfo}>
        <form
          onSubmit={studentInfo.handleSubmit(onSubmit)}
          className='space-y-3 mt-8'
        >
          <FormField
            control={studentInfo.control}
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
            control={studentInfo.control}
            name='childEmail'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Anak</FormLabel>
                <FormDescription>Email pribadi anak</FormDescription>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={studentInfo.control}
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
            control={studentInfo.control}
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
            control={studentInfo.control}
            name='childGender'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Jenis Kelamin' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='MALE'>Laki-laki</SelectItem>
                      <SelectItem value='FEMALE'>Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={studentInfo.control}
            name='educationInstitution'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asal Sekolah</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={studentInfo.control}
            name='gradeClass'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kelas</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='!mt-10 flex justify-end'>
            <Button type='submit'>
              {isSubmitting && (
                <Loader2 className='animate-spin mr-2 h-4 w-4' />
              )}
              Selanjutnya
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default StudentInfoForm;

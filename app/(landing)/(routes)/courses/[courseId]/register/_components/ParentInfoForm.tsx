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
import { Textarea } from '@/components/ui/textarea';
import { PhoneNumberValidationIDN } from '@/lib/validations/phone-number';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const parentInfoSchema = z.object({
  parentName: z.string().min(1, {
    message: 'Nama orang tua wajib diisi',
  }),
  parentEmail: z.string().email({
    message: 'Mohon masukkan email yang valid',
  }),
  phoneNumber: PhoneNumberValidationIDN,
  address: z.string().min(1, {
    message: 'Alamat wajib diisi',
  }),
});

interface ParentInfoFormProps {
  currentStep: number;
  setCurrentStep: (newStep: number) => void;
  initialParentInfo: z.infer<typeof parentInfoSchema>;
  setParentInfo: (newParentInfo: z.infer<typeof parentInfoSchema>) => void;
}

const ParentInfoForm = ({
  currentStep,
  setCurrentStep,
  initialParentInfo,
  setParentInfo,
}: ParentInfoFormProps) => {
  const parentInfo = useForm<z.infer<typeof parentInfoSchema>>({
    resolver: zodResolver(parentInfoSchema),
    defaultValues: {
      ...initialParentInfo,
    },
  });

  const { isSubmitting } = parentInfo.formState;

  const handleStepBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (values: z.infer<typeof parentInfoSchema>) => {
    setCurrentStep(currentStep + 1);
    setParentInfo(values);
  };

  return (
    <>
      <h2 className='text-3xl font-bold'>Data Orang Tua</h2>

      <Form {...parentInfo}>
        <form
          onSubmit={parentInfo.handleSubmit(onSubmit)}
          className='space-y-3 mt-8'
        >
          <FormField
            control={parentInfo.control}
            name='parentName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Orang Tua</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={parentInfo.control}
            name='parentEmail'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormDescription>Email pribadi orang tua</FormDescription>
                <FormControl>
                  <Input disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={parentInfo.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. HP</FormLabel>
                <FormDescription>
                  Gunakan nomor yang terdaftar di Whatsapp
                </FormDescription>
                <FormControl>
                  <Input type='number' disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={parentInfo.control}
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
          <div className='!mt-10 flex justify-between'>
            <Button type='button' variant='outline' onClick={handleStepBack}>
              Kembali
            </Button>
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

export default ParentInfoForm;

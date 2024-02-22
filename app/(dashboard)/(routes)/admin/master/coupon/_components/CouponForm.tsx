import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { addNewCoupon, updateCoupon } from '../_actions';
import { usePathname } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { modals } from '@mantine/modals';
import { Input } from '@/components/ui/input';
import { PhoneNumberValidation } from '@/lib/validations/phone-number';
import { DateInput } from '@mantine/dates';
import { Coupon } from '@prisma/client';

interface CouponFormProps {
  type: 'ADD' | 'EDIT';
  initialData?: Coupon;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  email: z
    .string()
    .email({
      message: 'Email is invalid',
    })
    .min(1, {
      message: 'Email is required',
    }),
  phoneNumber: PhoneNumberValidation,
  code: z.string().min(1, {
    message: 'Coupon code is required',
  }),
  expiredAt: z.date({
    required_error: 'Expired date is required',
  }),
});

const CouponForm = ({ type, initialData }: CouponFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      email: initialData?.email || '',
      expiredAt: initialData?.expiredAt || undefined,
      phoneNumber: initialData?.phoneNumber || '',
    },
  });

  const { isSubmitting } = form.formState;

  const pathname = usePathname()!;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (type === 'ADD') {
        const { error, message } = await addNewCoupon({
          payload: values,
          pathname,
        });

        if (error !== null) throw new Error(message);
        toast.success(message);
      } else {
        const { error, message } = await updateCoupon({
          id: initialData?.id!,
          payload: values,
          pathname,
        });

        if (error !== null) throw new Error(message);
        toast.success(message);
      }

      modals.closeAll();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-3'>
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='expiredAt'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expired At</FormLabel>
              <FormControl>
                <DateInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='pt-3 w-full flex justify-end'>
          <Button disabled={isSubmitting} type='submit' size='sm'>
            {isSubmitting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Save className='h-4 w-4' />
            )}{' '}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CouponForm;

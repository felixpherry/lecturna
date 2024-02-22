'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { fetchCouponByCode } from '../_actions';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';

const formSchema = z.object({
  coupon: z.string().length(8, {
    message: 'Masukkan kode kupon yang valid',
  }),
});

interface CouponFormProps {
  coupon: {
    id: string;
    code: string;
  };
  setCoupon: (coupon: { id: string; code: string }) => void;
}

const CouponForm = ({ coupon, setCoupon }: CouponFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coupon: coupon.code,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const coupon = await fetchCouponByCode(values.coupon);

      if (!coupon) {
        toast.error('Kupon yang Anda masukkan tidak valid');
        return;
      }

      setCoupon({
        id: coupon.id,
        code: coupon.code,
      });

      toast.success('Sukses menggunakan kupon');
    } catch {
      toast.error('Gagal menggunakan kupon. Coba lagi nanti.');
    } finally {
      form.reset();
    }
  };

  const removeCoupon = () => {
    setCoupon({
      id: '',
      code: '',
    });
  };

  return (
    <div className='flex flex-col gap-1'>
      {coupon.id && (
        <span className='flex gap-2 items-center text-xs'>
          <X className='cursor-pointer h-4 w-4' onClick={removeCoupon} />
          <span className='text-muted-foreground'>
            Menggunakan kupon <span className='font-bold'>{coupon.code}</span>
          </span>
        </span>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='coupon'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='w-full flex gap-0'>
                    <Input
                      placeholder='Masukkan Kode Kupon'
                      className='rounded-none rounded-l-sm focus-visible:ring-transparent border-r-0'
                      disabled={isSubmitting}
                      {...field}
                    />
                    <Button
                      type='submit'
                      size='sm'
                      className='rounded-none rounded-r-sm h-10 w-20 font-normal'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        'Gunakan'
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default CouponForm;

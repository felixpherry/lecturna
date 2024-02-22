import { Skill } from '@prisma/client';
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
import { addNewSkill, updateSkill } from '../_actions';
import { usePathname } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { modals } from '@mantine/modals';
import { Input } from '@/components/ui/input';

interface SkillFormProps {
  type: 'ADD' | 'EDIT';
  initialData?: Skill;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Skill name is required',
  }),
});

const SkillForm = ({ type, initialData }: SkillFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
    },
  });

  const { isSubmitting } = form.formState;

  const pathname = usePathname()!;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (type === 'ADD') {
        const { error, message } = await addNewSkill({
          payload: values,
          pathname,
        });

        if (error !== null) throw new Error(message);
        toast.success(message);
      } else {
        const { error, message } = await updateSkill({
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
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Name</FormLabel>
              <FormControl>
                <Input {...field} />
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

export default SkillForm;

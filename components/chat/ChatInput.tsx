'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { File } from 'lucide-react';
import { Input } from '../ui/input';
import EmojiPicker from './EmojiPicker';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import qs from 'query-string';
import { toast } from 'sonner';
import { modals } from '@mantine/modals';
import ChatAttachmentForm from './ChatAttachmentForm';

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ apiUrl, query }: ChatInputProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting } = form.formState;

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({ url: apiUrl, query });
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify(values),
      });

      form.reset();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=''>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='flex items-center p-4 gap-2'>
                  <Input
                    className='flex-1'
                    placeholder='Type a message...'
                    {...field}
                    disabled={isSubmitting}
                  />
                  <Button disabled={isSubmitting} size='sm' variant='default'>
                    Send
                  </Button>
                  <EmojiPicker
                    onChange={(emoji: string) =>
                      field.onChange(`${field.value}${emoji}`)
                    }
                  />
                  <button
                    type='button'
                    onClick={() =>
                      modals.open({
                        title: (
                          <h1 className='text-primary text-lg font-bold'>
                            Add an attachment
                          </h1>
                        ),
                        children: (
                          <ChatAttachmentForm apiUrl={apiUrl} query={query} />
                        ),
                        size: 'lg',
                      })
                    }
                  >
                    <File className='h-6 w-6 text-zinc-500 hover:text-zinc-600 transition' />
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;

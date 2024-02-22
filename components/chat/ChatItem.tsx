'use client';

import UserAvatar from '../UserAvatar';
import ActionTooltip from '../shared/ActionTooltip';
import {
  Edit,
  FileIcon,
  GraduationCap,
  Presentation,
  Trash,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn, convertToTitleCase } from '@/lib/utils';

import { Form, FormField, FormControl, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import qs from 'query-string';
import { Account, Instructor, Student } from '@prisma/client';
import { ConfirmModal } from '../modals/ConfirmModal';
import { toast } from 'sonner';

interface ChatItemProps {
  id: string;
  content: string;
  member:
    | ({
        account: Account;
      } & Instructor)
    | ({
        account: Account;
      } & Student);
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Student | Instructor;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  STUDENT: <GraduationCap className='w-4 h-4 ml-2 text-emerald-500' />,
  INSTRUCTOR: <Presentation className='w-4 h-4 ml-2 text-primary-blue' />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timestamp,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fileType = fileUrl?.split('.').pop();

  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && isOwner;

  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === 'pdf' && fileUrl;
  const isImage = !isPDF && fileUrl;

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(values),
      });

      form.reset();
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteMessage = async () => {
    const url = qs.stringifyUrl({
      url: `${socketUrl}/${id}`,
      query: socketQuery,
    });

    await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify({}),
    });
  };

  return (
    <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
      <div className='group flex gap-x-2 items-start w-full'>
        <div className='cursor-pointer hover:drop-shadow-md transition'>
          <UserAvatar src={member.account.image || ''} />
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex items-center gap-x-2'>
            <div className='flex items-center'>
              <p className='font-semibold text-sm hover:underline cursor-pointer'>
                {member.account.name}
              </p>
              <ActionTooltip label={convertToTitleCase(member.account.role)}>
                {roleIconMap[member.account.role as keyof typeof roleIconMap]}
              </ActionTooltip>
            </div>
            <span className='text-xs text-zinc-500'>{timestamp}</span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className='object-cover'
              />
            </a>
          )}
          {isPDF && (
            <div className='relative flex items-center p-2 mt-2 rounded-md bg-sky-200/20'>
              <FileIcon className='h-10 w-10 fill-sky-200/20 stroke-primary-blue' />
              <a
                href={fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-2 text-sm text-primary-blue hover:underline'
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600',
                deleted && 'italic text-zinc-500 text-xs mt-1'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className='text-[10px] mx-2 text-zinc-500'>(edited)</span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className='flex items-center w-full gap-x-2 pt-2'
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormControl>
                        <div className='relative w-full'>
                          <Input
                            className='p-2 bg-zinc-200/90 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600'
                            placeholder='Edited message'
                            {...field}
                            disabled={isSubmitting}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isSubmitting} size='sm'>
                  Save
                </Button>
              </form>
              <span className='text-[10px] mt-1 text-zinc-400'>
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white border rounded-sm'>
          {canEditMessage && (
            <ActionTooltip label='Edit'>
              <Edit
                onClick={() => setIsEditing(true)}
                className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 transition'
              />
            </ActionTooltip>
          )}
          <ConfirmModal
            title='Delete Message'
            description='Are you sure you want to delete this message?'
            onConfirm={handleDeleteMessage}
          >
            <ActionTooltip label='Delete'>
              <Trash className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 transition' />
            </ActionTooltip>
          </ConfirmModal>
        </div>
      )}
    </div>
  );
};

export default ChatItem;

'use client';

import { Button } from '@/components/ui/button';
import { File, Loader2, Pencil, PlusCircle, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Attachment } from '@prisma/client';
import { deleteAttachment } from '@/lib/actions/program.actions';
import { toast } from 'sonner';
import { modals } from '@mantine/modals';
import AttachmentForm from './AttachmentForm';

interface AttachmentListProps {
  attachments: Attachment[];
}

const AttachmentList = ({ attachments }: AttachmentListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const pathname = usePathname()!;

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteAttachment(id, pathname);
      toast.success('Successfully deleted attachment');
    } catch {
      toast.error('Failed to delete attachment');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course attachments
        <Button
          onClick={() =>
            modals.open({
              title: (
                <h1 className='text-primary text-lg font-semibold'>
                  Add Attachment
                </h1>
              ),
              size: 'xl',
              children: <AttachmentForm formType='ADD' />,
            })
          }
          variant='ghost'
        >
          <PlusCircle className='h-4 w-4 mr-2' />
          Add a file
        </Button>
      </div>
      {attachments.length > 0 && (
        <div className='space-y-2'>
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-primary-blue rounded-md'
            >
              <File className='h-4 w-4 mr-2 flex-shrink-0' />
              <a
                href={attachment.fileUrl}
                target='_blank'
                className='text-xs line-clamp-1'
              >
                {attachment.filename}
              </a>
              <div className='flex ml-auto items-center gap-3'>
                <button
                  onClick={() =>
                    modals.open({
                      title: (
                        <h1 className='text-primary text-lg font-semibold'>
                          Edit Attachment
                        </h1>
                      ),
                      size: 'xl',
                      children: (
                        <AttachmentForm
                          formType='EDIT'
                          initialData={attachment}
                        />
                      ),
                    })
                  }
                  className='hover:opacity-75 text-primary-blue'
                >
                  <Pencil className='h-4 w-4' />
                </button>
                {deletingId === attachment.id ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <button
                    onClick={() => handleDelete(attachment.id)}
                    className='hover:opacity-75 transition text-rose-500'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {attachments.length === 0 && (
        <p className={cn('text-sm mt-2 text-slate-500 italic')}>
          No attachments yet
        </p>
      )}
    </div>
  );
};

export default AttachmentList;

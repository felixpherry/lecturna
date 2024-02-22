'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { deleteAttachment } from '../_actions';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import { modals } from '@mantine/modals';
import { OtherAttachment } from '@prisma/client';
import AttachmentForm from './AttachmentForm';

interface AttachmentActionsProps {
  attachment: OtherAttachment;
}

const AttachmentActions = ({ attachment }: AttachmentActionsProps) => {
  const pathname = usePathname()!;
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAttachment({
        id: attachment.id,
        fileKey: attachment.fileKey,
        pathname,
      });
      toast.success('Successfully deleted attachment');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditForm = () => {
    modals.open({
      title: (
        <h1 className='text-primary text-lg font-semibold'>Edit Resource</h1>
      ),
      size: 'lg',
      children: (
        <AttachmentForm
          scheduleId={attachment.scheduleId}
          initialData={attachment}
          type='EDIT'
        />
      ),
    });
  };

  return (
    <div className='flex items-center gap-3'>
      <button onClick={openEditForm}>
        <Pencil className='h-4 w-4' />
      </button>
      {isLoading ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : (
        <ConfirmModal
          title='Are you sure?'
          description='Do you want to delete this resource?'
          onConfirm={handleDelete}
        >
          <Trash2 className='h-4 w-4' />
        </ConfirmModal>
      )}
    </div>
  );
};

export default AttachmentActions;

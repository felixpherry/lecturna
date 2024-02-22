'use client';

import { modals } from '@mantine/modals';
import { PlusSquareIcon } from 'lucide-react';
import AttachmentForm from './AttachmentForm';

interface AddAttachmentModalProps {
  scheduleId: string;
}

const AddAttachmentModal = ({ scheduleId }: AddAttachmentModalProps) => {
  return (
    <span
      onClick={() =>
        modals.open({
          title: (
            <h1 className='text-primary text-lg font-semibold'>Add Resource</h1>
          ),
          size: 'xl',
          children: <AttachmentForm scheduleId={scheduleId} type='ADD' />,
        })
      }
      className='flex items-center gap-3 p-3 rounded-md hover:bg-sky-200/20 cursor-pointer'
    >
      <PlusSquareIcon className='h-4 w-4' />
      <span>Add New Resource</span>
    </span>
  );
};

export default AddAttachmentModal;

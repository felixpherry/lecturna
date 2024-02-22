'use client';

import { EyeIcon, Loader2, PencilIcon, Trash2 } from 'lucide-react';
import { ClassTableInterface } from './columns';
import { modals } from '@mantine/modals';
import ClassForm from './ClassForm';
import { useClassFormStore } from '../_stores/use-class-form-store';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { deleteClass } from '../_actions';
import Link from 'next/link';

interface ClassTableActionsProps {
  classData: ClassTableInterface;
}

const ClassTableActions = ({ classData }: ClassTableActionsProps) => {
  const setFormType = useClassFormStore((state) => state.setFormType);
  const openModalForm = (type: 'VIEW' | 'EDIT') => {
    const title = type === 'EDIT' ? 'Edit Class' : 'Class Details';
    setFormType(type);
    modals.open({
      title: <h1 className='text-primary text-lg font-bold'>{title}</h1>,
      children: <ClassForm initialData={classData} />,
      size: 'xl',
    });
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const pathname = usePathname()!;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { error, message } = await deleteClass(classData.id, pathname);
      if (error !== null) throw new Error(message);
      toast.success(message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='flex items-center gap-4'>
      <Link href={`/classes/${classData.id}`}>
        <EyeIcon className='w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer' />
      </Link>
      <PencilIcon
        onClick={() => openModalForm('EDIT')}
        className='text-primary-blue cursor-pointer w-5 h-5'
      />
      {isDeleting ? (
        <Loader2 className='w-5 h-5 animate-spin' />
      ) : (
        <ConfirmModal
          title='Are you sure?'
          description='Do you want to delete this class?'
          onConfirm={handleDelete}
          variant={{
            confirm: 'destructive',
          }}
        >
          <Trash2 className='text-red-500 cursor-pointer w-5 h-5' />
        </ConfirmModal>
      )}
    </div>
  );
};

export default ClassTableActions;

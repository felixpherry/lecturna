'use client';

import { Button } from '@/components/ui/button';
import { modals } from '@mantine/modals';
import MappedClassForm from '../results/_components/MappedClassForm';
import { Plus } from 'lucide-react';
import { useMappedClassForm } from '../_stores/use-mapped-class-form';

const CreateClassButton = () => {
  const setFormType = useMappedClassForm((state) => state.setFormType);

  return (
    <Button
      onClick={() => {
        setFormType('ADD');
        modals.open({
          title: <h1 className='text-primary text-lg font-bold'>Add Class</h1>,
          children: <MappedClassForm />,
          size: 'xl',
        });
      }}
      variant='primary-blue'
      size='xs'
      className='flex items-center gap-2'
    >
      <Plus className='h-4 w-4' />
      Add
    </Button>
  );
};

export default CreateClassButton;

'use client';

import { modals } from '@mantine/modals';
import { Button, ButtonProps } from '../ui/button';
import { useState } from 'react';

interface ConfirmFormProps {
  description: string;
  variant?: {
    confirm?: ButtonProps['variant'];
    cancel?: ButtonProps['variant'];
  };
  label?: {
    confirm?: string;
    cancel?: string;
  };
  onConfirm: (...args: any[]) => Promise<unknown> | void;
}

const ConfirmForm = ({
  description,
  variant,
  label,
  onConfirm,
}: ConfirmFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    modals.closeAll();
    setIsLoading(false);
  };

  return (
    <div className='flex flex-col gap-5'>
      <p>{description}</p>
      <div className='w-full flex justify-end gap-3'>
        <Button
          onClick={() => modals.closeAll()}
          variant={variant?.cancel || 'outline'}
          size='sm'
          disabled={isLoading}
        >
          {label?.cancel || 'Cancel'}
        </Button>
        <Button
          onClick={handleConfirm}
          variant={variant?.confirm || 'default'}
          size='sm'
          disabled={isLoading}
        >
          {label?.confirm || 'Confirm'}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmForm;

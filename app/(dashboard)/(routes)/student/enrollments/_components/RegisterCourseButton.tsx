'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { enrollCourse } from '../_actions';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RegisterButtonProps {
  courseId: string;
}

const RegisterCourseButton = ({ courseId }: RegisterButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname()!;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await enrollCourse({
        pathname,
        courseId,
      });
      toast.success(
        'Successfully registered. Please wait for the admin approval'
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ConfirmModal
      title='Enrollment Confirmation'
      description='Are you sure you want to enroll in this course? Please note that your enrollment may be subject to approval. If you have any questions or concerns, feel free to contact us.'
      onConfirm={handleConfirm}
    >
      <Button className='my-2' size='sm' variant='primary-blue' asChild>
        <span className='w-full'>
          {isLoading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
          Register
        </span>
      </Button>
    </ConfirmModal>
  );
};

export default RegisterCourseButton;

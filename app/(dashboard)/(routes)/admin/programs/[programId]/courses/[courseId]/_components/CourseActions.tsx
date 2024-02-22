'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Button } from '@/components/ui/button';
import { publishCourse } from '@/lib/actions/course.actions';
import { deleteCourse, updateCourse } from '@/lib/actions/program.actions';
import { Course } from '@prisma/client';
import { Trash } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface CourseActionsProps {
  course: Course;
  disabled: boolean;
}

const CourseActions = ({ disabled, course }: CourseActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname()!;

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const { error, message } = await deleteCourse(course.id);
      if (error !== null) throw new Error(message);
      toast.success(message);

      router.refresh();
      router.push(`/admin/programs/${course.programId}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (course.isPublished) {
        const { error, message } = await updateCourse({
          id: course.id,
          pathname,
          payload: {
            programId: course.programId,
            isPublished: false,
          },
        });
        if (error !== null) throw new Error(error);
        toast.success(message);
      } else {
        const { error, message } = await publishCourse({
          courseId: course.id,
          pathname,
        });
        if (error !== null) throw new Error(error);
        toast.success(message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-x-2'>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant='outline'
        size='sm'
      >
        {course.isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal
        onConfirm={onDelete}
        title='Are you sure?'
        description='Do you want to delete this program? This actions cannot be undone.'
      >
        <Button asChild size='sm' disabled={isLoading}>
          <span>
            <Trash className='h-4 w-4' />
          </span>
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default CourseActions;

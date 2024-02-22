'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { convertToTitleCase } from '@/lib/utils';
import { IconCircleCheck } from '@tabler/icons-react';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import { useCreateClassStore } from '../../_stores/use-create-class-store';
import { useMappedClassForm } from '../../_stores/use-mapped-class-form';

interface SelectedInstructorTableProps {
  setIsEditingInstructor: (isEditingInstructor: boolean) => void;
  instructorScheduleId: string;
}

const SelectedInstructorTable = ({
  instructorScheduleId,
  setIsEditingInstructor,
}: SelectedInstructorTableProps) => {
  const instructorSchedule = useCreateClassStore((state) =>
    state.instructorSchedules.find(({ id }) => instructorScheduleId === id)
  );

  const formType = useMappedClassForm((state) => state.formType);

  if (!instructorSchedule) return null;

  return (
    <div className='flex flex-col gap-3 p-5 border rounded-md'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <IconCircleCheck className='text-primary-blue' />
          <h2 className='text-muted-foreground font-medium text-lg'>
            Instructor
          </h2>
        </div>
        {formType !== 'VIEW' && (
          <Button
            type='button'
            size='xs'
            variant='edit'
            onClick={() => setIsEditingInstructor(true)}
          >
            <Pencil className='h-3 w-3' />
            Edit
          </Button>
        )}
      </div>
      <hr />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-primary'>Name</TableHead>
              <TableHead className='text-primary'>Schedule</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className='flex gap-5 items-center'>
                  <Image
                    src={
                      instructorSchedule.instructor.account.image ||
                      '/avatar-fallback.svg'
                    }
                    alt={instructorSchedule.instructor.account.name}
                    width={25}
                    height={25}
                    className='rounded-full'
                  />
                  <div className='flex flex-col'>
                    <h3 className='text-primary text-sm font-semibold'>
                      {instructorSchedule.instructor.account.name}
                    </h3>
                    <p className='text-muted-foreground text-xs'>
                      {instructorSchedule.instructor.account.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {convertToTitleCase(instructorSchedule.day.day)},{' '}
                {instructorSchedule.shift.startTime} -{' '}
                {instructorSchedule.shift.endTime}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SelectedInstructorTable;

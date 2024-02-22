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
import {
  Account,
  Instructor,
  InstructorSchedule,
  MasterDay,
  MasterShift,
} from '@prisma/client';
import { IconCircleCheck } from '@tabler/icons-react';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import { useClassFormStore } from '../_stores/use-class-form-store';

export type InstructorScheduleTableInterface = {
  shift: MasterShift;
  day: MasterDay;
  instructor: {
    account: Account;
  } & Instructor;
} & InstructorSchedule;

interface SelectedInstructorTableProps {
  setIsEditingInstructor: (isEditingInstructor: boolean) => void;
  instructorSchedule: InstructorScheduleTableInterface;
}

const SelectedInstructorTable = ({
  instructorSchedule,
  setIsEditingInstructor,
}: SelectedInstructorTableProps) => {
  const formType = useClassFormStore((state) => state.formType);
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

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { useCreateClassStore } from '../../_stores/use-create-class-store';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { convertToTitleCase } from '@/lib/utils';
import { Input, Radio } from '@mantine/core';

interface AvailableInstructorsTableProps {
  instructorScheduleIds: string[];
  handleSelectInstructor: (selected: string) => void;
  setIsEditingInstructor: (isEditingInstructor: boolean) => void;
}

const AvailableInstructorsTable = ({
  instructorScheduleIds,
  handleSelectInstructor,
  setIsEditingInstructor,
}: AvailableInstructorsTableProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearch(e.target.value);
  };

  const instructorSchedules = useCreateClassStore(
    (state) => state.instructorSchedules
  );
  const getInstructorSchedule = (id: string) => {
    return instructorSchedules.find(
      (instructorSchedule) => instructorSchedule.id === id
    );
  };

  const filteredInstructorScheduleIds = instructorScheduleIds.filter((id) => {
    const account = getInstructorSchedule(id)?.instructor.account;

    if (!account) return false;
    return (
      account.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      account.email.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  });

  const currInstructorSchedules = filteredInstructorScheduleIds.slice(
    (page - 1) * 5,
    (page - 1) * 5 + 5
  );
  const hasNextPage =
    (page - 1) * 5 + currInstructorSchedules.length <
    filteredInstructorScheduleIds.length;
  const hasPrevPage = page !== 1;

  return (
    <div className='flex flex-col gap-3 p-5 border rounded-md'>
      <div className='flex justify-between items-center'>
        <h2 className='text-muted-foreground font-medium text-lg'>
          Instructors
        </h2>

        <div className='flex gap-2'>
          <Button
            type='button'
            size='xs'
            variant='outline'
            onClick={() => setIsEditingInstructor(false)}
          >
            Cancel
          </Button>
          <Button
            type='button'
            size='xs'
            disabled={selected === null}
            onClick={() => handleSelectInstructor(selected!)}
          >
            Save
          </Button>
        </div>
      </div>
      <hr />
      <Input
        placeholder='Search instructor...'
        value={search}
        onChange={handleSearch}
        className='md:w-1/2'
      />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-primary'>Select</TableHead>
              <TableHead className='text-primary'>No.</TableHead>
              <TableHead className='text-primary'>Name</TableHead>
              <TableHead className='text-primary'>Schedule</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currInstructorSchedules.map((id, idx) => (
              <TableRow
                key={id}
                onClick={() => setSelected(id)}
                className='cursor-pointer'
              >
                <TableCell>
                  <Radio checked={selected === id} readOnly />
                </TableCell>
                <TableCell>{(page - 1) * 5 + idx + 1}</TableCell>
                <TableCell>
                  <div className='flex gap-5 items-center'>
                    <Image
                      src={
                        getInstructorSchedule(id)?.instructor.account.image ||
                        '/avatar-fallback.svg'
                      }
                      alt={
                        getInstructorSchedule(id)?.instructor.account.name || ''
                      }
                      width={25}
                      height={25}
                      className='rounded-full'
                    />
                    <div className='flex flex-col'>
                      <h3 className='text-primary text-sm font-semibold'>
                        {getInstructorSchedule(id)?.instructor.account.name}
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        {getInstructorSchedule(id)?.instructor.account.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {convertToTitleCase(
                    getInstructorSchedule(id)?.day.day || '-'
                  )}
                  , {getInstructorSchedule(id)?.shift.startTime} -{' '}
                  {getInstructorSchedule(id)?.shift.endTime}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {currInstructorSchedules.length === 0 && (
        <p className='text-primary text-base font-semibold text-center'>
          No Instructors
        </p>
      )}
      <div className='flex justify-between items-center'>
        <p className='text-xs text-muted-foreground'>
          Showing {(page - 1) * 5 + 1} to{' '}
          {(page - 1) * 5 + currInstructorSchedules.length} of{' '}
          {filteredInstructorScheduleIds.length} entries
        </p>
        <div className='flex items-center gap-1'>
          <Button
            type='button'
            onClick={() => setPage(page - 1)}
            disabled={!hasPrevPage}
            variant='outline'
            size='xs'
          >
            Prev
          </Button>
          <Button
            type='button'
            size='xs'
            variant='primary-blue'
            className='w-8'
            disabled
          >
            {page}
          </Button>
          <Button
            type='button'
            onClick={() => setPage(page + 1)}
            disabled={!hasNextPage}
            variant='outline'
            size='xs'
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvailableInstructorsTable;

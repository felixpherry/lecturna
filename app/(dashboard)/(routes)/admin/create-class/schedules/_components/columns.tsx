'use client';

import { Button } from '@/components/ui/button';
import {
  Account,
  Course,
  Instructor,
  InstructorCourse,
  InstructorSchedule,
  MasterDay,
  MasterShift,
} from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { convertToTitleCase } from '@/lib/utils';
import Link from 'next/link';

type CreateClassSchedules = {
  day: MasterDay;
  shift: MasterShift;
  instructor: {
    account: Account;
    instructorCourses: Array<
      {
        course: Course;
      } & InstructorCourse
    >;
  } & Instructor;
} & InstructorSchedule;

export const columns: ColumnDef<CreateClassSchedules>[] = [
  {
    header: 'No',
  },
  {
    accessorKey: 'day',
    accessorFn: (originalRow) => {
      return convertToTitleCase(originalRow.day.day);
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Day
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className='font-bold text-primary'>
          {convertToTitleCase(row.original.day.day)}
        </span>
      );
    },
  },
  {
    accessorKey: 'shift',
    accessorFn: (originalRow) => {
      return `${originalRow.shift.startTime} - ${originalRow.shift.endTime}`;
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Shift
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'instructor',
    accessorFn: (originalRow) => {
      return originalRow.instructor.account.name;
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Instructor
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          className='font-medium text-primary-blue hover:underline'
          href={`/profile/${row.original.instructor.accountId}`}
        >
          {row.original.instructor.account.name}
        </Link>
      );
    },
  },
  {
    accessorKey: 'course',
    accessorFn: (originalRow) => {
      return originalRow.instructor.instructorCourses
        .map(({ course }) => course.name)
        .join(', ');
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Courses
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
];

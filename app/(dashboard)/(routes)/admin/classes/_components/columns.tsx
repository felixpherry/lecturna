'use client';

import { Button } from '@/components/ui/button';
import {
  Account,
  Class,
  Course,
  Instructor,
  InstructorSchedule,
  MasterDay,
  MasterShift,
  Period,
  Schedule,
  Student,
  StudentCourse,
} from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { convertToTitleCase } from '@/lib/utils';
import ClassTableActions from './ClassTableActions';
import moment from 'moment';

export type ClassTableInterface = {
  course: Course;
  period: Period;
  instructorSchedule:
    | ({
        day: MasterDay;
        instructor: {
          account: Account;
        } & Instructor;
        shift: MasterShift;
      } & InstructorSchedule)
    | null;
  schedules: Schedule[];
  studentCourses: Array<
    {
      student: {
        account: Account;
      } & Student;
    } & StudentCourse
  >;
} & Class;

export const columns: ColumnDef<ClassTableInterface>[] = [
  {
    header: 'No.',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, name } = row.original;

      return <ClassTableActions classData={row.original} />;
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className='font-bold text-primary'>{row.original.name}</span>
      );
    },
  },
  {
    accessorKey: 'course.name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Course
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.course.name;
    },
  },
  {
    accessorKey: 'period.name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Period
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <Badge>{row.original.period.name}</Badge>;
    },
  },
  {
    accessorKey: 'instructorSchedule',
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
        <span className='font-bold text-primary'>
          {row.original.instructorSchedule?.instructor.account.name}
        </span>
      );
    },
  },
  {
    accessorKey: 'instructorSchedule',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Schedule
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { instructorSchedule } = row.original;
      const formattedSchedule = `${convertToTitleCase(
        instructorSchedule?.day.day || '-'
      )}, ${instructorSchedule?.shift.startTime} - ${
        instructorSchedule?.shift.endTime
      }`;
      return formattedSchedule;
    },
  },

  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return (
        <span className='font-bold text-muted-foreground'>
          {moment(row.getValue('createdAt')).format('DD/MM/YYYY')}
        </span>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => {
      return (
        <span className='font-bold text-muted-foreground'>
          {moment(row.getValue('updatedAt')).format('DD/MM/YYYY')}
        </span>
      );
    },
  },
];

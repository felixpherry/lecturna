'use client';

import { Account, Course, Student, StudentCourse } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type CreateClassStudentsTable = {
  course: Course;
  student: {
    account: Account;
  } & Student;
} & StudentCourse;

export const columns: ColumnDef<CreateClassStudentsTable>[] = [
  {
    header: 'No',
  },
  {
    accessorKey: 'student',
    accessorFn: (originalRow) => {
      return originalRow.student.account.name;
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/profile/${row.original.student.accountId}`}
          className='font-medium text-primary-blue hover:underline'
        >
          {row.original.student.account.name}
        </Link>
      );
    },
  },
  {
    accessorKey: 'studentId',
    accessorFn: (originalRow) => {
      return originalRow.student.studentId;
    },
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Student ID
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className='font-bold text-primary'>
          {row.original.student.studentId}
        </span>
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
          className='whitespace-nowrap'
        >
          Course
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
];

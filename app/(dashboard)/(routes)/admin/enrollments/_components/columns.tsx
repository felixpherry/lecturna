'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Badge, BadgeProps } from '@/components/ui/badge';
import {
  Account,
  Course,
  RegistrationStatus,
  Student,
  StudentCourse,
} from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { updateEnrollmentStatus } from '../_actions';
import moment from 'moment';
import ActionTooltip from '@/components/shared/ActionTooltip';

export const columns: ColumnDef<
  {
    course: Course;
    student: {
      account: Account;
    } & Student;
  } & StudentCourse
>[] = [
  {
    header: 'No',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id } = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname()!;

      const confirmStatus = async (status: RegistrationStatus) => {
        try {
          const { error, message } = await updateEnrollmentStatus({
            pathname,
            status,
            studentCourseId: id,
          });

          if (error !== null) throw new Error(message);
          toast.success(message);
        } catch (error: any) {
          toast.error(error.message);
        }
      };

      return (
        <div className='flex items-center gap-6'>
          {row.getValue('status') === 'PENDING' && (
            <>
              <ConfirmModal
                title='Approve Enrollment'
                description='Do you want to approve this enrollment'
                onConfirm={() => confirmStatus('APPROVED')}
              >
                <ActionTooltip label='Approve'>
                  <ThumbsUp className='text-green-500 cursor-pointer' />
                </ActionTooltip>
              </ConfirmModal>
              <ConfirmModal
                title='Reject Enrollment'
                description='Do you want to reject this enrollment'
                onConfirm={() => confirmStatus('REJECTED')}
              >
                <ActionTooltip label='Reject'>
                  <ThumbsDown className='text-red-500 cursor-pointer' />
                </ActionTooltip>
              </ConfirmModal>
            </>
          )}
          <Link href={`/profile/${row.original.student.accountId}`}>
            <ActionTooltip label='Profile'>
              <Eye className='text-muted-foreground hover:text-primary' />
            </ActionTooltip>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    accessorFn: ({ student }) => {
      return student.account.name;
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
      const { student } = row.original;
      return (
        <div className='text-primary font-semibold'>{student.account.name}</div>
      );
    },
  },
  {
    accessorKey: 'studentId',
    accessorFn: ({ student }) => {
      return student.studentId;
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
        <div className='text-primary font-semibold'>
          {row.original.student.studentId}
        </div>
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
  {
    accessorKey: 'student.account.phoneNumber',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Phone Number
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.student.account.phoneNumber || '-'}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status: RegistrationStatus = row.getValue('status') || 'PENDING';

      const statusVariant = (
        row.getValue('status') as string
      ).toLocaleLowerCase() as BadgeProps['variant'];
      return (
        <Badge variant={statusVariant}>
          {status[0] + status.substring(1).toLocaleLowerCase()}
        </Badge>
      );
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

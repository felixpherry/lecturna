'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { InstructorRegistration, RegistrationStatus } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import {
  createAccountForInstructor,
  updateInstructorRegistrationStatus,
} from '../_actions';
import InstructorRegistrationDetail from './InstructorRegistrationDetail';
import moment from 'moment';
import ActionTooltip from '@/components/shared/ActionTooltip';

export const columns: ColumnDef<InstructorRegistration>[] = [
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

      const instructorData = row.original as {
        skills: {
          id: string;
          name: string;
        }[];
      } & InstructorRegistration;

      const confirmStatus = async (status: RegistrationStatus) => {
        try {
          const { error, message } = await updateInstructorRegistrationStatus({
            id,
            status,
            pathname,
          });

          if (error !== null) throw new Error(message);

          toast.success(message);
          if (status === 'APPROVED') {
            try {
              const { error, message } = await createAccountForInstructor(
                instructorData
              );

              if (error !== null) throw new Error(message);

              toast.success(message);
            } catch (error: any) {
              toast.error(error.message);
            }
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      };

      return (
        <div className='flex items-center gap-6'>
          {row.getValue('status') === 'PENDING' && (
            <>
              <ConfirmModal
                title='Approve Registration'
                description='Do you want to approve this registration'
                onConfirm={() => confirmStatus('APPROVED')}
              >
                <ActionTooltip label='Approve'>
                  <ThumbsUp className='text-green-500 cursor-pointer' />
                </ActionTooltip>
              </ConfirmModal>
              <ConfirmModal
                title='Reject Registration'
                description='Do you want to reject this registration'
                onConfirm={() => confirmStatus('REJECTED')}
              >
                <ActionTooltip label='Reject'>
                  <ThumbsDown className='text-red-500 cursor-pointer' />
                </ActionTooltip>
              </ConfirmModal>
            </>
          )}

          <InstructorRegistrationDetail data={instructorData} />
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
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
        <span className='font-bold text-primary'>{row.getValue('name')}</span>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'phoneNumber',
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

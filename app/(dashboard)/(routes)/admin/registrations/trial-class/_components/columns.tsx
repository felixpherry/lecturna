'use client';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { RegistrationStatus, TrialClassRegistration } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ThumbsDown, ThumbsUp } from 'lucide-react';
import moment from 'moment';
import { updateTrialClassRegistrationStatus } from '../_actions';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import TrialClassDetail from './TrialClassDetail';
import ActionTooltip from '@/components/shared/ActionTooltip';

export const columns: ColumnDef<TrialClassRegistration>[] = [
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
          const { error, message } = await updateTrialClassRegistrationStatus({
            id,
            status,
            pathname,
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
                title='Approve Registration'
                description='Do you want to approve this registration?'
                onConfirm={() => confirmStatus('APPROVED')}
              >
                <ActionTooltip label='Approve'>
                  <ThumbsUp className='text-green-500 cursor-pointer' />
                </ActionTooltip>
              </ConfirmModal>
              <ConfirmModal
                title='Reject Registration'
                description='Do you want to reject this registration?'
                onConfirm={() => confirmStatus('REJECTED')}
              >
                <ActionTooltip label='Reject'>
                  <ThumbsDown className='text-red-500 cursor-pointer' />
                </ActionTooltip>
              </ConfirmModal>
            </>
          )}

          <TrialClassDetail
            data={
              row.original as {
                course: {
                  name: string;
                };
              } & TrialClassRegistration
            }
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'childName',
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
        <span className='font-bold text-primary'>
          {row.getValue('childName')}
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
    accessorKey: 'trialClassDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Trial Class Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const trialClassDate: Date = row.getValue('trialClassDate');
      return <>{moment(trialClassDate).format('DD MMM YYYY hh:mm')}</>;
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

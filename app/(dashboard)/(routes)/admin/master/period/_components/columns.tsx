'use client';

import { Period } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PencilIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import moment from 'moment';
import PeriodForm from './PeriodForm';
import { modals } from '@mantine/modals';
import { changePeriodStatus, deletePeriod } from '../_actions';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import SwitchAction from '@/components/shared/SwitchAction';

export const columns: ColumnDef<Period>[] = [
  {
    header: 'No',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, name } = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname()!;

      const confirmDelete = async () => {
        try {
          const { error, message } = await deletePeriod({
            id,
            pathname,
          });

          if (error !== null) throw new Error(message);
          toast.success(message);
        } catch (error: any) {
          toast.error(error.message);
        }
      };
      return (
        <div className='flex items-center gap-4'>
          <PencilIcon
            onClick={() => {
              modals.open({
                title: (
                  <p className='text-primary font-semibold'>Edit Period</p>
                ),
                children: <PeriodForm type='EDIT' initialData={row.original} />,
                centered: true,
                size: 'lg',
              });
            }}
            className='text-primary-blue cursor-pointer w-5 h-5'
          />
          <ConfirmModal
            title={`Delete ${name}?`}
            description='Are you sure you want to delete this period? This action can
          not be undone'
            onConfirm={confirmDelete}
            variant={{
              confirm: 'destructive',
            }}
          >
            <Trash2 className='text-red-500 cursor-pointer w-5 h-5' />
          </ConfirmModal>
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Active',
    cell: ({ row }) => {
      const { id, isActive } = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname()!;

      const changeStatus = async (checked: boolean) => {
        try {
          const { error, message } = await changePeriodStatus({
            id,
            isActive: checked,
            pathname,
          });

          if (error !== null) throw new Error(message);

          toast.success(message);
        } catch (error: any) {
          toast.error(error.message);
        }
      };

      return <SwitchAction active={isActive} onChange={changeStatus} />;
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
          Period
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
    accessorKey: 'startDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Start Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { startDate } = row.original;
      return <>{moment(startDate).format('DD/MM/YYYY')}</>;
    },
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          End Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { endDate } = row.original;
      return <>{moment(endDate).format('DD/MM/YYYY')}</>;
    },
  },
  {
    accessorKey: 'statusChangedDate',
    header: () => {
      return <span className='whitespace-nowrap'>Status Changed Date</span>;
    },
    cell: ({ row }) => {
      return (
        <span className='font-bold text-muted-foreground'>
          {row.getValue('statusChangedDate') !== null
            ? moment(row.getValue('statusChangedDate')).format('DD/MM/YYYY')
            : '-'}
        </span>
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

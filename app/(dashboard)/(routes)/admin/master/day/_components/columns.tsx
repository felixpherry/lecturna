'use client';

import { MasterDay } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { changeDayStatus } from '../_actions';
import { convertToTitleCase } from '@/lib/utils';
import moment from 'moment';
import SwitchAction from '@/components/shared/SwitchAction';

export const columns: ColumnDef<MasterDay>[] = [
  {
    header: 'No',
  },
  {
    id: 'actions',
    header: 'Active',
    cell: ({ row }) => {
      const { id, isActive } = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname()!;

      const changeStatus = async (checked: boolean) => {
        try {
          const { error, message } = await changeDayStatus({
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
    accessorKey: 'day',
    header: 'Day',
    cell: ({ row }) => {
      return (
        <span className='font-bold text-primary'>
          {convertToTitleCase(row.getValue('day'))}
        </span>
      );
    },
  },
  {
    accessorKey: 'statusChangedDate',
    header: 'Status Changed Date',
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

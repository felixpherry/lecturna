'use client';

import { Coupon } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PencilIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { modals } from '@mantine/modals';
import { updateCouponStatus, deleteCoupon } from '../_actions';
import CouponForm from './CouponForm';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import SwitchAction from '@/components/shared/SwitchAction';
import moment from 'moment';

export const columns: ColumnDef<Coupon>[] = [
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

      const confirmDelete = async () => {
        try {
          const { error, message } = await deleteCoupon({
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
                  <p className='text-primary font-semibold'>Edit Coupon</p>
                ),
                children: <CouponForm type='EDIT' initialData={row.original} />,
                centered: true,
                size: 'lg',
              });
            }}
            className='text-primary-blue cursor-pointer h-5 w-5'
          />
          <ConfirmModal
            title='Delete Coupon'
            description='Are you sure you want to delete this coupon? This action can
            not be undone'
            onConfirm={confirmDelete}
            variant={{
              confirm: 'destructive',
            }}
          >
            <Trash2 className='text-red-500 cursor-pointer h-5 w-5' />
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
          const { error, message } = await updateCouponStatus({
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
    accessorKey: 'code',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Code
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span className='text-primary'>{row.original.code}</span>;
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
      return <span className='whitespace-nowrap'>{row.original.name}</span>;
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
    accessorKey: 'expiredAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Expired At
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{moment(row.original.expiredAt).format('DD/MM/YYYY')}</span>;
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

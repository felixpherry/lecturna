'use client';

import { Faq } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PencilIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { modals } from '@mantine/modals';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { deleteFaq } from '@/lib/actions/faq.actions';
import FaqForm from './FaqForm';

export const columns: ColumnDef<Faq>[] = [
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
          const { error, message } = await deleteFaq(id, pathname);
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
                title: <p className='text-primary font-semibold'>Edit FAQ</p>,
                children: <FaqForm type='EDIT' initialData={row.original} />,
                centered: true,
                size: 'lg',
              });
            }}
            className='text-primary-blue cursor-pointer w-5 h-5'
          />
          <ConfirmModal
            title={`Delete ${name}?`}
            description='Are you sure you want to delete this FAQ? This action can
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
    accessorKey: 'question',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Question
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className='font-bold text-primary'>
          {row.getValue('question')}
        </span>
      );
    },
  },
  {
    accessorKey: 'answer',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='whitespace-nowrap'
        >
          Answer
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className='font-medium text-muted-foreground'>
          {row.getValue('answer')}
        </span>
      );
    },
  },
];

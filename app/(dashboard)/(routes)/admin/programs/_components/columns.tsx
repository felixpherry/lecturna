'use client';

import { Button } from '@/components/ui/button';
import { Program } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, PencilIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import moment from 'moment';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { toast } from 'sonner';
import { deleteProgram } from '@/lib/actions/program.actions';
import { usePathname } from 'next/navigation';

export const columns: ColumnDef<Program>[] = [
  {
    header: 'No.',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, name } = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname()!;

      const handleDelete = async () => {
        try {
          const { error, message } = await deleteProgram(id, pathname);
          if (error !== null) throw new Error(message);
          toast.success(message);
        } catch (error: any) {
          toast.error(error.message);
        }
      };

      return (
        <div className='flex items-center gap-4'>
          <Link href={`/admin/programs/${id}`}>
            <PencilIcon className='text-primary-blue cursor-pointer w-5 h-5' />
          </Link>
          <ConfirmModal
            title='Are you sure?'
            description='Do you want to delete this program? This actions cannot be undone.'
            onConfirm={handleDelete}
          >
            <Trash2 className='text-red-500 cursor-pointer w-5 h-5' />
          </ConfirmModal>
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
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'subtitle',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Subtitle
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'isPublished',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Published
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished') || false;

      return (
        <Badge className={cn('bg-slate-500', isPublished && 'bg-sky-700')}>
          {isPublished ? 'Published' : 'Draft'}
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

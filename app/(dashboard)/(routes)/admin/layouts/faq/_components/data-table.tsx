'use client';

import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { modals } from '@mantine/modals';
import { Plus } from 'lucide-react';
import { Input } from '@mantine/core';
import TanstackTable from '@/components/shared/TanstackTable';
import FaqForm from './FaqForm';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className='flex flex-col gap-3'>
      <div className='p-5 flex flex-col md:flex-row items-center justify-start gap-6 bg-white rounded-sm shadow'>
        <div className='flex w-full md:w-fit items-center gap-[10px]'>
          <p className='text-muted-foreground font-bold text-sm min-w-[48px]'>
            Search:
          </p>

          <Input
            placeholder='Search question...'
            value={
              (table.getColumn('question')?.getFilterValue() as string) ?? ''
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn('question')?.setFilterValue(event.target.value)
            }
            className='w-full md:w-64'
          />
        </div>
        <Button
          size='sm'
          variant='primary-blue'
          onClick={() => {
            modals.open({
              title: <p className='text-primary font-semibold'>Add FAQ</p>,
              children: <FaqForm type='ADD' />,
              centered: true,
              size: 'lg',
            });
          }}
          className='ml-auto'
        >
          <Plus className='h-4 w-4' />
          Add
        </Button>
      </div>
      <div className='p-5 bg-white rounded-sm shadow'>
        <TanstackTable
          columns={columns}
          data={data}
          table={table}
          withPagination={true}
        />
      </div>
    </div>
  );
}

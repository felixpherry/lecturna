'use client';

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';

import { useState } from 'react';
import { Input } from '@mantine/core';
import TanstackTable from '@/components/shared/TanstackTable';
import FilterSelect from '@/components/shared/FilterSelect';
import { statusOptions } from '@/constants';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
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
            id='day'
            placeholder='Search day...'
            value={(table.getColumn('day')?.getFilterValue() as string) ?? ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn('day')?.setFilterValue(event.target.value)
            }
            className='w-full md:w-fit'
          />
        </div>
        <div className='flex w-full md:w-fit items-center gap-[10px]'>
          <p className='text-muted-foreground font-bold text-sm min-w-[48px]'>
            Status:
          </p>
          <FilterSelect
            options={statusOptions}
            withSearchParams
            defaultValue='active'
            searchParamsKey='status'
            className='w-full md:w-fit'
          />
        </div>
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

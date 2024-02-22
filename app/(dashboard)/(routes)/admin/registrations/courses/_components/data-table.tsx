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

import { useState } from 'react';
import FilterSelect from '@/components/shared/FilterSelect';
import { MantineSelectOption } from '@/types';
import TanstackTable from '@/components/shared/TanstackTable';
import { registrationStatusOptions } from '@/constants';
import { Input } from '@mantine/core';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  courseOptions: MantineSelectOption[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  courseOptions,
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
    <div>
      <div className='flex items-center py-4 gap-x-5 gap-y-2 flex-col md:flex-row'>
        <Input
          placeholder='Search name...'
          value={
            (table.getColumn('childName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn('childName')?.setFilterValue(event.target.value)
          }
          className='w-full md:w-1/3'
        />
        <FilterSelect
          options={registrationStatusOptions}
          withSearchParams={true}
          searchParamsKey='status'
          defaultValue='pending'
        />
        <FilterSelect
          options={courseOptions}
          withSearchParams={true}
          searchParamsKey='course'
        />
      </div>
      <TanstackTable
        columns={columns}
        data={data}
        table={table}
        withPagination={true}
      />
    </div>
  );
}

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
import { MantineSelectOption } from '@/types';
import FilterSelect from '@/components/shared/FilterSelect';
import { Input } from '@mantine/core';
import TanstackTable from '@/components/shared/TanstackTable';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  courseOptions: MantineSelectOption[];
  dayOptions: MantineSelectOption[];
  shiftOptions: MantineSelectOption[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  courseOptions,
  dayOptions,
  shiftOptions,
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
      <Input
        placeholder='Search instructor...'
        value={
          (table.getColumn('instructor')?.getFilterValue() as string) ?? ''
        }
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          table.getColumn('instructor')?.setFilterValue(event.target.value)
        }
        className='w-full md:w-1/3'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
        <FilterSelect
          options={courseOptions}
          withSearchParams={true}
          searchParamsKey='course'
        />
        <FilterSelect
          options={dayOptions}
          withSearchParams={true}
          searchParamsKey='day'
        />
        <FilterSelect
          options={shiftOptions}
          withSearchParams={true}
          searchParamsKey='shift'
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

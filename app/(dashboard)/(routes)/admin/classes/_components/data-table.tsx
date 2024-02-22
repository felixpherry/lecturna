'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useState } from 'react';

import { MantineSelectOption } from '@/types';
import FilterSelect from '@/components/shared/FilterSelect';
import TanstackTable from '@/components/shared/TanstackTable';
import { Input } from '@mantine/core';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  courseOptions: MantineSelectOption[];
  periodOptions: MantineSelectOption[];
  currentPeriodId: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  periodOptions,
  courseOptions,
  currentPeriodId,
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
            placeholder='Search classes...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className='w-full md:w-fit'
          />
        </div>
        <div className='flex w-full md:w-fit items-center gap-[10px]'>
          <p className='text-muted-foreground font-bold text-sm min-w-[48px]'>
            Course:
          </p>
          <FilterSelect
            options={courseOptions}
            withSearchParams
            defaultValue=''
            searchParamsKey='course'
            className='w-full md:w-fit'
          />
        </div>
        <div className='flex w-full md:w-fit items-center gap-[10px]'>
          <p className='text-muted-foreground font-bold text-sm min-w-[48px]'>
            Period:
          </p>
          <FilterSelect
            options={periodOptions}
            withSearchParams
            defaultValue={currentPeriodId}
            searchParamsKey='period'
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

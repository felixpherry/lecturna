'use client';

import {
  ColumnDef,
  flexRender,
  type Table as TableInterface,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import Pagination from './Pagination';

interface TanstackTableProps<TData, TValue> {
  table: TableInterface<TData>;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  withPagination: boolean;
}

export default function TanstackTable<TData, TValue>({
  table,
  data,
  columns,
  withPagination,
}: TanstackTableProps<TData, TValue>) {
  const page = table.getState().pagination.pageIndex + 1;
  return (
    <>
      <div className='rounded-md border'>
        <Table className='text-muted-foreground font-semibold'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIdx) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell, cellIdx) => {
                    if (cellIdx === 0)
                      return (
                        <TableCell key={cell.id}>
                          {(page - 1) * 10 + rowIdx + 1}
                        </TableCell>
                      );
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {withPagination && (
        <Pagination
          getNextPage={table.nextPage}
          getPrevPage={table.previousPage}
          limit={10}
          withSearchParams={false}
          page={page}
          count={data.length}
        />
      )}
    </>
  );
}

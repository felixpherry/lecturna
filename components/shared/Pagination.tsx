'use client';

import { useEffect } from 'react';
import { Button } from '../ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  page: number;
  limit: number;
  count: number;
  withSearchParams: boolean;
  getNextPage: () => void;
  getPrevPage: () => void;
}

const Pagination = ({
  count,
  page,
  limit,
  withSearchParams,
  getNextPage,
  getPrevPage,
}: PaginationProps) => {
  const totalPage = Math.ceil(count / limit);

  const hasPrevPage = page !== 1;
  const hasNextPage = page < totalPage;

  const router = useRouter();
  const searchParams = useSearchParams()!;
  const pathname = usePathname()!;

  useEffect(() => {
    if (withSearchParams) {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      router.push(pathname + '?' + params.toString());
    }
  }, [page, pathname, router, searchParams, withSearchParams]);

  if (count === 0) return null;

  return (
    <div className='flex justify-between items-center my-2'>
      <p className='text-xs text-muted-foreground'>
        Showing {(page - 1) * limit + 1} to{' '}
        {(page - 1) * limit +
          (page === totalPage && count % limit !== 0
            ? count % limit
            : limit)}{' '}
        of {count} entries
      </p>
      <div className='flex items-center gap-1'>
        <Button
          type='button'
          onClick={getPrevPage}
          disabled={!hasPrevPage}
          variant='outline'
          size='sm'
        >
          Prev
        </Button>
        <Button
          type='button'
          size='sm'
          variant='primary-blue'
          className='w-8'
          disabled
        >
          {page}
        </Button>
        <Button
          type='button'
          onClick={getNextPage}
          disabled={!hasNextPage}
          variant='outline'
          size='sm'
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

'use client';

import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface CoursesPaginationProps {
  hasNextPage: boolean;
}

const CoursesPagination = ({ hasNextPage }: CoursesPaginationProps) => {
  const router = useRouter();
  const pathname = usePathname()!;
  const searchParams = useSearchParams()!;
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    newPage === 1
      ? params.delete('page')
      : params.set('page', newPage.toString());
    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  return (
    <div className='flex items-center justify-center gap-3 mt-14'>
      <Button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        variant='secondary'
        className='shadow text-slate-700 border disabled:opacity-50'
      >
        Prev
      </Button>
      <Button
        variant='primary-blue'
        className='hover:bg-primary-blue cursor-default'
      >
        {page}
      </Button>
      <Button
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasNextPage}
        variant='secondary'
        className='shadow text-slate-700 border disabled:opacity-50'
      >
        Next
      </Button>
    </div>
  );
};

export default CoursesPagination;

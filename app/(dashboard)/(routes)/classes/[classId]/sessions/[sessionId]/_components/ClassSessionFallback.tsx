import { Skeleton } from '@/components/ui/skeleton';
import { Fragment } from 'react';

const ClassSessionFallback = () => {
  const tabSkeletons = new Array(8).fill(
    <Skeleton className='h-12 w-24 rounded-t-md' />
  );
  return (
    <div className='flex flex-col gap-0'>
      <div className='w-full'>
        <div className='flex gap-1 overflow-x-auto no-scrollbar'>
          {tabSkeletons.map((skeleton, idx) => (
            <Fragment key={idx}>{skeleton}</Fragment>
          ))}
        </div>
      </div>
      <Skeleton className='w-full h-96 rounded-b-md' />
    </div>
  );
};

export default ClassSessionFallback;

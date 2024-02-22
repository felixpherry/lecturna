import { Skeleton } from '@/components/ui/skeleton';
import { Fragment } from 'react';

const ClassLeaderboardFallback = () => {
  const skeletons = new Array(12).fill(
    <div className='grid grid-cols-12 gap-3'>
      <Skeleton className='col-span-1 h-12' />
      <Skeleton className='col-span-4 h-12' />
      <Skeleton className='col-span-3 h-12' />
      <Skeleton className='col-span-2 h-12' />
      <Skeleton className='col-span-2 h-12' />
    </div>
  );
  return (
    <div className='flex flex-col gap-3'>
      {skeletons.map((skeleton, idx) => (
        <Fragment key={idx}>{skeleton}</Fragment>
      ))}
    </div>
  );
};

export default ClassLeaderboardFallback;

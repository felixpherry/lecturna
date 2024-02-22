import { Skeleton } from '@/components/ui/skeleton';
import { Fragment } from 'react';

const ClassMembersFallback = () => {
  const skeletons = new Array(16).fill(<Skeleton className='h-72' />);
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
      {skeletons.map((skeleton, idx) => (
        <Fragment key={idx}>{skeleton}</Fragment>
      ))}
    </div>
  );
};

export default ClassMembersFallback;

import { Skeleton } from '@/components/ui/skeleton';

const CourseProgramBadgesSkeleton = () => {
  return (
    <div className='flex gap-3 flex-wrap mt-8'>
      <Skeleton className='w-16 h-8 rounded-full' />
      <Skeleton className='w-24 h-8 rounded-full' />
      <Skeleton className='w-24 h-8 rounded-full' />
      <Skeleton className='w-24 h-8 rounded-full' />
    </div>
  );
};

export default CourseProgramBadgesSkeleton;

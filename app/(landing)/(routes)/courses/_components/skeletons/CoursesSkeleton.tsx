import { Skeleton } from '@/components/ui/skeleton';

const CoursesSkeleton = () => {
  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        <Skeleton className='w-full h-[420px] rounded-lg' />
        <Skeleton className='w-full h-[420px] rounded-lg' />
        <Skeleton className='w-full h-[420px] rounded-lg' />
        <Skeleton className='w-full h-[420px] rounded-lg' />
        <Skeleton className='w-full h-[420px] rounded-lg' />
        <Skeleton className='w-full h-[420px] rounded-lg' />
      </div>
      <div className='flex items-center justify-center gap-3 mt-14'>
        <Skeleton className='w-16 h-12' />
        <Skeleton className='w-12 h-12' />
        <Skeleton className='w-16 h-12' />
      </div>
    </>
  );
};

export default CoursesSkeleton;

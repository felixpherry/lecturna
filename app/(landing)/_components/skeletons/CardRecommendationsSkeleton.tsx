import { Skeleton } from '@/components/ui/skeleton';

const CardRecommendationsSkeleton = () => {
  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        <Skeleton className='w-full h-[420px] rounded-lg' />
        <Skeleton className='w-full h-[420px] rounded-lg' />
        <Skeleton className='w-full h-[420px] rounded-lg' />
      </div>
    </>
  );
};

export default CardRecommendationsSkeleton;

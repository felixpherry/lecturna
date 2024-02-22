import CourseLevelSelect from './CourseLevelSelect';
import CourseSearchBox from './CourseSearchBox';
import { Suspense } from 'react';
import CourseCategorySelectProvider from './providers/CourseCategorySelectProvider';
import CourseProgramBadgesProvider from './providers/CourseProgramBadgesProvider';
import CourseCategorySelectSkeleton from './skeletons/CourseCategorySelectSkeleton';
import CourseProgramBadgesSkeleton from './skeletons/CourseProgramBadgesSkeleton';

const CoursesFilter = async () => {
  return (
    <div className='my-10'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
        <CourseSearchBox />
        <CourseLevelSelect />
        <Suspense fallback={<CourseCategorySelectSkeleton />}>
          <CourseCategorySelectProvider />
        </Suspense>
      </div>
      <Suspense fallback={<CourseProgramBadgesSkeleton />}>
        <CourseProgramBadgesProvider />
      </Suspense>
    </div>
  );
};

export default CoursesFilter;

import Image from 'next/image';
import Link from 'next/link';
import CoursesFilter from './_components/CoursesFilter';
import Courses from './_components/Courses';
import { Suspense } from 'react';
import CoursesSkeleton from './_components/skeletons/CoursesSkeleton';

interface CoursePageProps {
  searchParams: {
    search?: string;
    category?: string;
    level?: string;
    program?: string;
    page?: string;
  };
}

const Page = async ({ searchParams }: CoursePageProps) => {
  return (
    <div>
      <div className='bg-gradient-to-l from-[#273575] to-[#004AAD]'>
        <div className='relative container max-w-7xl text-center py-24'>
          <div className='flex flex-col items-center gap-y-2'>
            <h1 className='font-josefin font-bold text-3xl md:text-4xl lg:text-5xl text-white animate-appearance-in'>
              Kursus
            </h1>
            <ul className='flex justify-center items-center gap-3 text-white font-semibold'>
              <li>
                <Link href='/' className='hover:text-primary-yellow'>
                  Beranda
                </Link>
              </li>
              <li className='bg-white w-[6px] h-[6px] rounded-full'></li>
              <li>Kursus</li>
            </ul>
          </div>
          <Image
            src='/rocket.png'
            height={130}
            width={130}
            alt='rocket'
            className='absolute z-10 bottom-1 left-2 animate-bounce running w-24 h-24 md:w-40 md:h-40'
          />
          <Image
            src='/planets.png'
            height={150}
            width={300}
            alt='planets'
            className='absolute z-10 bottom-8 right-2 animate-pulse h-[40px] w-[180px] md:h-[68px] md:w-[300px]'
          />
        </div>
      </div>
      <div className='container max-w-7xl my-28'>
        <h3 className='text-4xl font-semibold'>Daftar Kursus</h3>
        <p className='text-lg mt-1 text-slate-700'>Jelajahi kursus kami</p>
        <CoursesFilter />
        <Suspense fallback={<CoursesSkeleton />}>
          <Courses searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;

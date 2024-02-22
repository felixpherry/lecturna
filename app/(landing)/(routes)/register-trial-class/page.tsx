import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import TrialClassRegistrationForm from './_components/TrialClassRegistrationForm';

const Page = async () => {
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      isDeleted: false,
      program: {
        isPublished: true,
        isDeleted: false,
      },
    },
  });

  return (
    <div>
      <div className='bg-gradient-to-l from-[#273575] to-[#004AAD]'>
        <div className='relative container max-w-7xl text-center py-24'>
          <div className='flex flex-col items-center gap-y-2'>
            <h1 className='font-josefin font-bold text-3xl md:text-4xl lg:text-5xl text-white animate-appearance-in'>
              Daftar Trial Class
            </h1>
            <ul className='flex justify-center items-center gap-3 text-white font-semibold'>
              <li>
                <Link href='/' className='hover:text-primary-yellow'>
                  Beranda
                </Link>
              </li>
              <li className='bg-white w-[6px] h-[6px] rounded-full'></li>
              <li>Daftar Trial Class</li>
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

      <div className='flex justify-center'>
        <TrialClassRegistrationForm courses={courses} />
      </div>
    </div>
  );
};

export default Page;

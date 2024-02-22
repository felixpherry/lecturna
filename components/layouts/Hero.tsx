import { SessionInterface } from '@/types';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

interface HeroProps {
  title: string;
  subtitle: string;
  image: string;
  session: SessionInterface;
}

const Hero = ({ title, subtitle, image, session }: HeroProps) => {
  return (
    <div className='container max-w-7xl pb-20 flex flex-col text-center lg:flex-row-reverse lg:text-left relative'>
      <div className='absolute top-[100px] lg:top-[unset] 2xl:h-[700px] 2xl:w-[700px] lg:h-[600px] lg:w-[600px] h-[40vh] right-5 w-[40vh] hero_animation rounded-[50%] lg:right-8 2xl:right-14'></div>
      <div className='lg:w-[40%] flex items-center justify-end pt-[70px] lg:pt-[0] z-10'>
        <Image
          src={image}
          width={400}
          height={400}
          alt='hero image'
          className='object-contain lg:max-w-[90%] w-[90%] 2xl:max-w-[85%] h-[auto] z-[10]'
        />
      </div>
      <div className='lg:w-[60%] flex flex-col gap-5 lg:pt-20 lg:pl-12'>
        <h1 className='text-[#000000c7] text-[30px] w-full lg:text-[60px] font-[600] font-josefin lg:leading-[75px] 2xl:w-[60%] lg:w-[78%] px-3 py-2'>
          {title}
        </h1>
        <p className='text-[#000000ac] font-josefin font-[600] text-[18px] 2xl:!w-[55%] lg:!w-[78%]'>
          {subtitle}
        </p>
        <div className='w-full flex flex-col px-8 lg:px-0 lg:flex-row gap-5 mt-2'>
          {!session?.user ? (
            <>
              <Button
                variant='primary-blue'
                className='h-14 rounded-full px-12 text-base font-semibold'
                asChild
              >
                <Link href='/register-trial-class'>Daftar Trial Class</Link>
              </Button>

              <Button
                variant='primary-blue-outline'
                className='h-14 rounded-full px-12 text-base font-semibold'
                asChild
              >
                <Link href='/courses'>Lihat Kursus</Link>
              </Button>
            </>
          ) : (
            <Button
              variant='primary-blue'
              className='h-14 rounded-full px-12 text-base font-semibold'
              asChild
            >
              <Link href='/dashboard'>Lihat Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;

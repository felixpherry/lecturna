import { Badge, BadgeProps } from '@/components/ui/badge';
import { db } from '@/lib/db';
import {
  BarChart,
  CalendarCheck,
  CalendarDays,
  GraduationCap,
  Shapes,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import moment from 'moment';
import Preview from '@/components/shared/Preview';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CourseRecommendations from './_components/CourseRecommendations';
import { Suspense } from 'react';
import CardRecommendationsSkeleton from '@/app/(landing)/_components/skeletons/CardRecommendationsSkeleton';

interface PageProps {
  params: {
    courseId: string;
  };
}

const Page = async ({ params: { courseId } }: PageProps) => {
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      category: {
        select: {
          ageDescription: true,
        },
      },
      program: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          sessions: {
            where: {
              isPublished: true,
            },
          },
        },
      },
      classes: {
        select: {
          _count: {
            select: {
              studentCourses: true,
            },
          },
        },
      },
    },
  });

  if (!course) return notFound();
  const {
    id,
    image,
    name,
    level,
    category,
    description,
    programId,
    programmingTools,
    updatedAt,
    program,
    _count,
  } = course;

  const students = await db.student.count({
    where: {
      studentCourses: {
        some: {
          course: {
            id,
          },
        },
      },
    },
  });

  return (
    <div className='text-primary'>
      <div className='bg-gradient-to-l from-[#273575] to-[#004AAD]'>
        <div className='relative container max-w-7xl text-center py-24'>
          <div className='flex flex-col items-center gap-y-2'>
            <h1 className='font-josefin font-bold text-3xl md:text-4xl lg:text-5xl text-white animate-appearance-in'>
              {name}
            </h1>
            <ul className='flex justify-center items-center gap-3 text-white font-semibold'>
              <li>
                <Link href='/courses' className='hover:text-primary-yellow'>
                  Kursus
                </Link>
              </li>
              <li className='bg-white w-[6px] h-[6px] rounded-full'></li>
              <li>{name}</li>
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
        <div className='grid grid-cols-1 md:grid-cols-3'>
          <div className='col-span-1 lg:col-start-3'>
            <Card className='shadow-lg hover:shadow-2xl rounded-md'>
              <CardContent className='overflow-visible p-0'>
                <div className='relative'>
                  <Image
                    width={480}
                    height={140}
                    alt={name}
                    className='w-full object-cover h-[240px] rounded-t-lg relative'
                    src={image || ''}
                  />
                </div>
                <div className='flex flex-col gap-8 px-8 py-10'>
                  <div className='flex justify-between items-center font-semibold'>
                    <span className='flex items-center gap-2'>
                      <Shapes className='w-6 h-6 text-primary-blue' />
                      <span>Kategori</span>
                    </span>
                    <span className='text-muted-foreground'>
                      {category?.ageDescription}
                    </span>
                  </div>
                  <div className='flex justify-between items-center font-semibold'>
                    <span className='flex items-center gap-2'>
                      <BarChart className='w-6 h-6 text-primary-blue' />
                      <span>Tingkatan</span>
                    </span>
                    <span className='text-muted-foreground'>
                      {level?.[0]! + level?.substring(1).toLocaleLowerCase()!}
                    </span>
                  </div>
                  <div className='flex justify-between items-center font-semibold'>
                    <span className='flex items-center gap-2'>
                      <CalendarDays className='w-6 h-6 text-primary-blue' />
                      <span>Sesi</span>
                    </span>
                    <span className='text-muted-foreground'>
                      {_count.sessions} sesi
                    </span>
                  </div>

                  <div className='flex justify-between items-center font-semibold'>
                    <span className='flex items-center gap-2'>
                      <GraduationCap className='w-6 h-6 text-primary-blue' />
                      <span>Enrolled</span>
                    </span>
                    <span className='text-muted-foreground'>
                      {students} siswa
                    </span>
                  </div>

                  <div className='flex flex-col gap-3'>
                    <Button variant='primary-blue' className='w-full' asChild>
                      <Link href={`/courses/${id}/register`}>Daftar</Link>
                    </Button>
                    <Button
                      variant='primary-blue-outline'
                      className='w-full'
                      asChild
                    >
                      <Link href={`/register-trial-class`}>
                        Daftar Trial Class
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='row-start-2 mt-14 lg:mt-0 lg:row-start-1 col-start-1 col-end-3 lg:px-10'>
            <div className='flex flex-col gap-5'>
              <h2 className='text-2xl md:text-3xl font-bold font-josefin'>
                {name}
              </h2>

              <Link href={`/programs/${programId}`}>
                <Badge className='cursor-pointer py-2 px-4'>
                  {program.name}
                </Badge>
              </Link>
              <div className='flex gap-6 flex-wrap mb-5'>
                <div className='flex items-center gap-3'>
                  <Shapes className='w-6 h-6 text-primary-blue' />
                  <div className='flex flex-col'>
                    <span className='text-muted-foreground'>Kategori</span>
                    <span className='font-semibold'>
                      {category?.ageDescription}
                    </span>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <BarChart className='w-6 h-6 text-primary-blue' />
                  <div className='flex flex-col'>
                    <span className='text-muted-foreground'>Tingkatan</span>
                    <span className='font-semibold'>
                      {level?.[0]! + level?.substring(1)?.toLocaleLowerCase() ||
                        ''}
                    </span>
                  </div>
                </div>
                {students >= 10 && (
                  <div className='flex items-center gap-3'>
                    <Users className='w-6 h-6 text-primary-blue' />
                    <div className='flex flex-col'>
                      <span className='text-muted-foreground'>Siswa</span>
                      <span className='font-semibold'>{students}</span>
                    </div>
                  </div>
                )}

                <div className='flex items-center gap-3'>
                  <CalendarCheck className='w-6 h-6 text-primary-blue' />
                  <div className='flex flex-col'>
                    <span className='text-muted-foreground'>Last Updated</span>
                    <span className='font-semibold'>
                      {moment(updatedAt).format('DD/MM/YYYY')}
                    </span>
                  </div>
                </div>
              </div>
              <h3 className='text-2xl font-bold'>Deskripsi</h3>
              <div className=''>
                <Preview
                  value={description || ''}
                  className='[&_.ql-editor]:px-0 text-muted-foreground'
                />
              </div>
              <h3 className='text-2xl font-bold'>Alat Pemrograman</h3>
              <div>
                <Preview
                  value={programmingTools || ''}
                  className='[&_.ql-editor]:px-0 [&_ul]:!p-0 text-muted-foreground'
                />
              </div>
            </div>
          </div>
        </div>
        <section className='flexCenter w-full gap-8 mt-28 lg:px-10'>
          <span className='w-full h-0.5 bg-light-white-200' />
          <Image
            src={'/logo.png'}
            className='rounded-full min-w-[82px] h-[82px]'
            width={82}
            height={82}
            alt='profile image'
          />
          <span className='w-full h-0.5 bg-light-white-200' />
        </section>
        <Suspense fallback={<CardRecommendationsSkeleton />}>
          <CourseRecommendations programId={programId} courseId={courseId} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;

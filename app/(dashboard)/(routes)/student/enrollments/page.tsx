import { getCurrentPeriod, getNextPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { MantineSelectOption, SessionInterface } from '@/types';
import { Level } from '@prisma/client';
import { redirect } from 'next/navigation';
import { CourseCatalog } from './_types';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Code2,
  XCircle,
} from 'lucide-react';
import FilterSelect from '@/components/shared/FilterSelect';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import CourseSearchBox from './_components/CourseSearchBox';
import CoursesPagination from '@/app/(landing)/(routes)/courses/_components/CoursesPagination';
import RegisterCourseButton from './_components/RegisterCourseButton';

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    level?: string;
    category?: string;
  };
}

const badgeColor: Record<Level, string> = {
  BEGINNER: 'bg-green-500',
  INTERMEDIATE: 'bg-blue-600',
  ADVANCED: 'bg-red-600',
};

const Page = async ({ searchParams }: PageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  if (session.user.role !== 'STUDENT') return redirect('/not-found');

  const nextPeriod = await getNextPeriod();

  const studentCourses = await db.studentCourse.findMany({
    where: {
      student: { accountId: session.user.id },
      periodId: nextPeriod?.id,
    },
  });

  const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  const baseCourseQuery = {
    isDeleted: false,
    isPublished: true,
    program: {
      isDeleted: false,
      isPublished: true,
    },
    name: {
      contains: searchParams.search,
    },
    level: levels.includes(searchParams.level?.toLocaleUpperCase() || '')
      ? (searchParams.level?.toLocaleUpperCase() as Level)
      : undefined,
    categoryId: searchParams.category,
  };

  const [availableCourses, count, categories] = await Promise.all([
    db.course.findMany({
      where: baseCourseQuery,
      include: {
        category: true,
        _count: {
          select: {
            sessions: true,
          },
        },
      },
      take: 12,
      skip: ((Number(searchParams.page) || 1) - 1) * 12,
    }),
    db.course.count({
      where: baseCourseQuery,
    }),
    db.category.findMany(),
  ]);

  const hasNextPage = (Number(searchParams.page) || 1) * 12 < count;

  const courses = availableCourses.reduce((acc, curr) => {
    const studentCourse = studentCourses.find(
      ({ courseId }) => courseId === curr.id
    );

    acc.push({
      courseId: curr.id,
      classId: studentCourse?.classId ?? null,
      sessions: curr._count.sessions,
      image: curr.image,
      level: curr.level!,
      name: curr.name,
      status: studentCourse?.status ?? null,
    });
    return acc;
  }, [] as CourseCatalog[]);

  const levelOptions: MantineSelectOption[] = [
    {
      label: 'All',
      value: '',
    },
    {
      label: 'Beginner',
      value: 'beginner',
    },
    {
      label: 'Intermediate',
      value: 'intermediate',
    },
    {
      label: 'Advanced',
      value: 'advanced',
    },
  ];

  const categoryOptions: MantineSelectOption[] = categories.map(
    ({ id, ageDescription }) => ({
      label: ageDescription,
      value: id,
    })
  );

  return (
    <div className='flex flex-col gap-8 min-h-[calc(100vh-80px)]'>
      <h1 className='text-2xl text-primary font-bold'>Courses</h1>
      <div className='flex flex-col gap-3 flex-1'>
        <div className='p-5 bg-white shadow flex lg:items-center gap-5 flex-wrap flex-col lg:flex-row'>
          <div className='flex lg:items-center gap-3 flex-col lg:flex-row w-full lg:w-fit'>
            <span className='text-muted-foreground font-bold'>Search:</span>
            <CourseSearchBox />
          </div>
          <div className='flex lg:items-center gap-3 flex-col lg:flex-row w-full lg:w-fit'>
            <span className='text-muted-foreground font-bold'>Category:</span>
            <FilterSelect
              options={categoryOptions}
              withSearchParams
              defaultValue=''
              searchParamsKey='category'
            />
          </div>
          <div className='flex lg:items-center gap-3 flex-col lg:flex-row w-full lg:w-fit'>
            <span className='text-muted-foreground font-bold'>Level:</span>
            <FilterSelect
              options={levelOptions}
              withSearchParams
              defaultValue=''
              searchParamsKey='level'
            />
          </div>
        </div>
        <div className='p-5 shadow bg-white flex-1 flex flex-col'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full h-fit'>
            {courses.map(
              ({ classId, courseId, sessions, image, level, name, status }) => (
                <div
                  key={courseId}
                  className='p-3 shadow hover:bg-light-white-100 rounded-md flex flex-col gap-2 group'
                >
                  <div className='relative rounded-md w-full h-36'>
                    <div className='card-image_shadow absolute h-full w-full top-0 left-0 rounded-tr-lg z-[1]' />
                    <Image
                      src={image || ''}
                      alt={name}
                      fill
                      className='rounded-md'
                    />
                    <span
                      className={cn(
                        'absolute p-2 top-3 text-[12px] right-3 text-white font-semibold rounded-lg z-10',
                        badgeColor[level as Level]
                      )}
                    >
                      {level}
                    </span>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <h6 className='text-primary font-medium text-lg group-hover:text-primary-blue'>
                      {name}
                    </h6>
                    <div className='flex items-center gap-1 text-muted-foreground'>
                      <CalendarDays className='h-4 w-4' />
                      <span className='text-sm'>{sessions} sessions</span>
                    </div>

                    {status === 'PENDING' && (
                      <Button
                        className='my-2'
                        size='sm'
                        variant='generate-class'
                        disabled
                      >
                        <Clock className='h-4 w-4' />
                        Pending
                      </Button>
                    )}
                    {status === 'APPROVED' && classId !== null && (
                      <Button className='my-2' size='sm'>
                        <Link href={`/classes/${classId}`}>Go to Class</Link>
                      </Button>
                    )}
                    {status === 'APPROVED' && classId === null && (
                      <Button
                        className='my-2 bg-emerald-500 hover:bg-emerald-500 text-white hover:text-white cursor-not-allowed'
                        size='sm'
                        variant='outline'
                      >
                        <CheckCircle2 className='h-4 w-4' /> Approved
                      </Button>
                    )}
                    {status === null && (
                      <RegisterCourseButton courseId={courseId} />
                    )}
                    {status === 'REJECTED' && (
                      <Button
                        // className='my-2 bg-emerald-500 hover:bg-emerald-500 text-white hover:text-white cursor-not-allowed'
                        className='my-2 cursor-not-allowed'
                        size='sm'
                        variant='destructive'
                      >
                        <XCircle className='h-4 w-4' /> Rejected
                      </Button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
          {courses.length === 0 && (
            <div className='flex items-center justify-center flex-col gap-5 flex-1'>
              <Code2 className='text-muted-foreground h-24 w-24' />
              <div className='flex flex-col gap-1 justify-center items-center'>
                <h3 className='text-primary font-semibold text-xl'>
                  No Course
                </h3>
                <p className='text-muted-foreground'>
                  There is no course available.
                </p>
              </div>
            </div>
          )}
          <CoursesPagination hasNextPage={hasNextPage} />
        </div>
      </div>
    </div>
  );
};

export default Page;

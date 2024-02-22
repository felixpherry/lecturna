import FilterSelect from '@/components/shared/FilterSelect';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getCurrentPeriod, getNextPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import {
  ClassCollectionDetail,
  MantineSelectOption,
  SessionInterface,
} from '@/types';
import { Period } from '@prisma/client';
import { CalendarDays, ChevronDown, Folder, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  getInstructorClasses,
  getParentClasses,
  getStudentClasses,
} from './_actions';
import { getClassTabs } from './_utils';

interface PageProps {
  searchParams?: {
    period: string;
  };
}

const page = async ({ searchParams }: PageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  const [allPeriods, currPeriod] = await Promise.all([
    db.period.findMany({
      where: { isActive: true },
    }),
    getCurrentPeriod(),
  ]);

  const periodId = searchParams?.period || currPeriod?.id;

  let classes: ClassCollectionDetail[] = [];

  switch (session.user.role) {
    case 'INSTRUCTOR':
      classes = (await getInstructorClasses(
        session.user.id,
        periodId
      )) as ClassCollectionDetail[];
      break;
    case 'STUDENT':
      classes = (await getStudentClasses(
        session.user.id,
        periodId
      )) as ClassCollectionDetail[];
      break;
    case 'PARENT':
      classes = (await getParentClasses(
        session.user.id,
        periodId
      )) as ClassCollectionDetail[];
  }

  const periodOptions: MantineSelectOption[] = allPeriods.map(
    ({ id, name }) => ({
      label: name,
      value: id,
    })
  );

  const getProgress = (id: string) => {
    const classData = classes.find((classData) => classData.id === id);
    if (!classData || classData.schedules.length === 0) return 0;
    return (
      (classData.schedules.filter(
        ({ scheduleDate }) => scheduleDate.getTime() < new Date().getTime()
      ).length /
        classData.schedules.length) *
      100
    );
  };

  const isObserver =
    session.user.role !== 'INSTRUCTOR' && session.user.role !== 'STUDENT';

  return (
    <div className='flex flex-col gap-8 min-h-[calc(100vh-80px)]'>
      <h1 className='text-2xl text-primary font-bold'>
        {isObserver ? 'Classes' : 'My Classes'}
      </h1>
      <div className='flex flex-col gap-3 flex-1'>
        <div className='p-5 bg-white shadow'>
          <div className='flex items-center gap-3'>
            <span className='text-muted-foreground font-bold'>Period:</span>
            <FilterSelect
              options={periodOptions}
              withSearchParams={true}
              defaultValue={currPeriod?.id || ''}
              searchParamsKey='period'
            />
          </div>
        </div>
        <div className='p-5 shadow bg-white flex-1 flex'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mx-auto'>
            {classes.map(
              ({ course, id, schedules, name, instructorSchedule, _count }) => (
                <Link
                  key={id}
                  href={getClassTabs(session.user.role, id)[0]?.href || ''}
                  className='group'
                >
                  <Card className='shadow-lg hover:shadow-2xl' key={id}>
                    <CardContent className='overflow-visible p-0 pb-5'>
                      <div className='relative'>
                        <div className='card-image_shadow absolute h-full w-full top-0 left-0 rounded-tr-lg z-20' />
                        <Image
                          width={480}
                          height={140}
                          alt={course.name}
                          className='w-full object-cover h-[160px] rounded-t-lg relative'
                          src={course.image || '/card-placeholder.png'}
                        />
                      </div>
                      <div className='px-6 mt-4 flex flex-col gap-8'>
                        <h3 className='text-xl font-semibold hover:text-primary-blue'>
                          {course.name} - {name}
                        </h3>
                        <div className='max-h-0 hidden transition-all duration-500 group-hover:flex group-hover:justify-between hover:max-h-96'>
                          <div className='flex items-center gap-1'>
                            <CalendarDays className='w-4 h-4 text-primary-blue' />
                            <span className='text-muted-foreground text-sm'>
                              {schedules.length} sessions
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <GraduationCap className='h-4 w-4 text-primary-blue' />
                            <span className='text-muted-foreground text-sm'>
                              {_count.studentCourses} students
                            </span>
                          </div>
                        </div>
                        <div className='mx-auto'>
                          <ChevronDown className='h-4 w-4 text-muted-foreground transition-all duration-500 group-hover:rotate-180' />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className='flex flex-col w-full gap-3'>
                        <div className='h-3 bg-secondary rounded-full'>
                          <div
                            className='h-full bg-primary-blue rounded-full'
                            style={{
                              width: `${getProgress(id)}%`,
                            }}
                          />
                        </div>
                        <div className='flex justify-between w-full'>
                          <div className='flex gap-1 items-center'>
                            <Image
                              src={
                                instructorSchedule?.instructor.account.image ||
                                '/avatar-fallback.svg'
                              }
                              alt={
                                instructorSchedule?.instructor.account.name ||
                                ''
                              }
                              height={30}
                              width={30}
                              className='rounded-full h-8 w-8'
                            />
                            <p className='font-light'>
                              {instructorSchedule?.instructor.account.name}
                            </p>
                          </div>
                          <div className='flex flex-col items-end text-primary-blue'>
                            <span className='font-medium'>
                              {Math.round(getProgress(id))}%
                            </span>
                            <span className='font-light'>Complete</span>
                          </div>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              )
            )}
          </div>
          {classes.length === 0 && (
            <div className='flex items-center justify-center flex-col gap-5 flex-1'>
              <Folder className='text-muted-foreground h-24 w-24' />
              <div className='flex flex-col gap-1 justify-center items-center'>
                <h3 className='text-primary font-semibold text-xl'>No Class</h3>
                <p className='text-muted-foreground'>
                  {isObserver
                    ? 'There is no class scheduled for this period.'
                    : 'You have no classes scheduled for this period.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;

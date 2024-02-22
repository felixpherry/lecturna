import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getChildAccountId } from '@/lib/actions/parent.actions';
import { getCurrentPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import {
  Calendar,
  CalendarX2,
  Clock,
  File,
  Mail,
  ServerIcon,
} from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  const childAccountId = await getChildAccountId(session.user.id);

  if (!childAccountId) return redirect('/not-found');

  const childStudent = await db.student.findUnique({
    where: { accountId: childAccountId },
  });

  if (!childStudent) return redirect('/not-found');

  const accountDetail = await db.account.findUnique({
    where: { id: session.user.id },
  });

  const currentPeriod = await getCurrentPeriod();

  if (!accountDetail) return redirect('/not-found');

  const classes = await db.class.findMany({
    where: {
      studentCourses: {
        some: {
          studentId: childStudent?.id,
        },
      },
      periodId: currentPeriod?.id,
    },
    take: 2,
    orderBy: {
      period: {
        startDate: 'desc',
      },
    },
    include: {
      instructorSchedule: {
        include: {
          instructor: {
            include: {
              account: true,
            },
          },
        },
      },
      course: true,
      schedules: true,
    },
  });

  const schedules = await db.schedule.findMany({
    where: {
      class: {
        studentCourses: {
          some: {
            student: {
              accountId: childAccountId,
            },
          },
        },
      },
      scheduleDate: new Date(),
    },
    include: {
      class: {
        include: {
          course: true,
        },
      },
    },
    orderBy: {
      scheduleTime: 'asc',
    },
  });

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

  return (
    <div className='flex flex-col gap-5 font-josefin container max-w-7xl p-0'>
      <h1 className='font-extrabold text-3xl'>Dashboard</h1>
      <div className='flex flex-col-reverse md:flex-row gap-5'>
        <div className='w-full md:w-2/3 flex flex-col gap-5'>
          <div className='w-full p-8 rounded-md shadow-sm bg-[#e3e5fe]'>
            <div className='flex flex-col gap-5 relative'>
              <div className='flex flex-col gap-1'>
                <h3 className='font-semibold text-xl'>Welcome to Lecturna</h3>
                <p className='text-muted-foreground'>
                  Stay up to date with your child&apos;s learning progress
                </p>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-5'>
            <div className='flex justify-between items-center'>
              <h2 className='font-extrabold text-2xl'>Schedule</h2>
              <Link
                href='/schedule'
                className='text-primary-blue hover:underline text-sm font-medium'
              >
                View All
              </Link>
            </div>
            {schedules.length === 0 ? (
              <div className='flex items-center justify-center flex-col gap-5 py-5 flex-1 bg-white'>
                <CalendarX2 className='text-muted-foreground h-24 w-24' />
                <div className='flex flex-col gap-1 justify-center items-center'>
                  <h3 className='text-primary font-semibold text-xl'>
                    No Schedule
                  </h3>
                  <p className='text-muted-foreground'>
                    There is no schedule available for today.
                  </p>
                </div>
              </div>
            ) : (
              <div className='flex flex-col w-full gap-3 bg-white'>
                {schedules
                  .slice(0, 2)
                  .map(
                    ({
                      class: classData,
                      id,
                      scheduleDate,
                      scheduleTime,
                      sessionNumber,
                      meetingUrl,
                    }) => (
                      <div
                        key={id}
                        className='flex flex-col gap-2 p-5 border rounded-md shadow w-full hover:shadow-lg'
                      >
                        <h3 className='font-bold text-primary text-xl'>
                          {classData.course.code} - {classData.course.name}
                        </h3>
                        <p className='font-semibold text-base text-muted-foreground'>
                          {classData.name}
                        </p>
                        <div className='flex items-center gap-1 text-primary'>
                          <ServerIcon className='w-4 h-4' />
                          Session {sessionNumber}
                        </div>
                        <div className='flex items-center gap-1 text-primary'>
                          <Clock className='w-4 h-4' />
                          Time: {scheduleTime}
                        </div>
                        <div className='flex items-center gap-1 text-primary'>
                          <Calendar className='w-4 h-4' />
                          Date:{' '}
                          {moment
                            .utc(scheduleDate, 'DD-MM-YYYY')
                            .format('DD MMM YYYY')}
                        </div>
                        <div className='flex gap-3 items-center'>
                          <Button
                            size='sm'
                            variant='primary-blue'
                            className='w-fit mt-1'
                          >
                            {!meetingUrl ? (
                              <Link href={`/classes/${classData.id}/meeting`}>
                                Join Meeting
                              </Link>
                            ) : (
                              <a href={meetingUrl} target='_blank'>
                                Join Meeting
                              </a>
                            )}
                          </Button>
                          <Button
                            size='sm'
                            variant='primary-blue-outline'
                            className='w-fit mt-1'
                            asChild
                          >
                            <Link
                              href={`/classes/${classData.id}/sessions/${id}`}
                            >
                              Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )
                  )}
              </div>
            )}
          </div>

          <div className='flex flex-col gap-5'>
            <div className='flex justify-between items-center'>
              <h2 className='font-extrabold text-2xl'>Classes</h2>
              <Link
                href='/classes'
                className='text-primary-blue hover:underline text-sm font-medium'
              >
                View All
              </Link>
            </div>
            {classes.length === 0 ? (
              <div className='flex items-center justify-center flex-col gap-5 py-5 flex-1 bg-white'>
                <File className='text-muted-foreground h-24 w-24' />
                <div className='flex flex-col gap-1 justify-center items-center'>
                  <h3 className='text-primary font-semibold text-xl'>
                    No Class
                  </h3>
                  <p className='text-muted-foreground'>
                    There is no class available.
                  </p>
                </div>
              </div>
            ) : (
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {classes.map(
                  ({ course, id, name, instructorSchedule, schedules }) => (
                    <Link
                      key={id}
                      href={`/classes/${id}/sessions/${schedules[0].id}`}
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
                              src={course.image || ''}
                            />
                          </div>
                          <div className='px-6 mt-4 flex flex-col gap-8'>
                            <h3 className='text-xl font-semibold hover:text-primary-blue'>
                              {course.name} - {name}
                            </h3>
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
                                    instructorSchedule?.instructor.account
                                      .image || ''
                                  }
                                  alt={
                                    instructorSchedule?.instructor.account
                                      .name || ''
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
            )}
          </div>
        </div>
        <div className='w-full md:w-1/3'>
          <div className='bg-white rounded-md shadow-sm'>
            <Image
              src='/dashboard-banner.jpg'
              className='w-full h-32 rounded-t-md'
              height={160}
              width={320}
              alt='Profile Banner'
            />
            <div className='flex flex-col gap-5 px-5 relative -top-10'>
              <div className='rounded-md p-2 shadow-md bg-white w-fit'>
                <Image
                  src={accountDetail.image || '/avatar-fallback.svg'}
                  alt={accountDetail.name}
                  width={64}
                  height={64}
                  className='h-16 w-16 rounded-md'
                />
              </div>

              <div className='flex flex-col gap-2'>
                <h3 className='text-base font-bold'>{accountDetail.name}</h3>
                <div className='flex gap-2 items-center'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <p className='text-muted-foreground text-sm'>
                    {accountDetail.email}
                  </p>
                </div>
                <Button
                  variant='primary-blue-outline'
                  size='xs'
                  className='rounded-full font-semibold leading-3 mt-1'
                  asChild
                >
                  <Link href={`/profile/${session.user.id}/edit`}>
                    Edit profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

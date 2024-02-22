import ScheduleDatePicker from '@/components/ScheduleDatePicker';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/session';
import { ScheduleWithClassWithCourse, SessionInterface } from '@/types';
import { Calendar, CalendarX2, Clock, ServerIcon } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import {
  getInstructorSchedule,
  getParentSchedule,
  getStudentSchedule,
} from './_actions';
import { notFound } from 'next/navigation';

interface PageProps {
  searchParams?: {
    date: string;
  };
}

const page = async ({ searchParams }: PageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return notFound();

  const scheduleDate = moment.utc(searchParams?.date, 'DD-MM-YYYY').isValid()
    ? moment.utc(searchParams?.date, 'DD-MM-YYYY').toDate()
    : new Date();

  let schedules: ScheduleWithClassWithCourse[] = [];

  switch (session.user.role) {
    case 'STUDENT':
      schedules = await getStudentSchedule(session.user.id, scheduleDate);
      break;
    case 'INSTRUCTOR':
      schedules = await getInstructorSchedule(session.user.id, scheduleDate);
      break;
    case 'PARENT':
      schedules = await getParentSchedule(session.user.id, scheduleDate);
      break;
  }

  const isObserver =
    session.user.role !== 'INSTRUCTOR' && session.user.role !== 'STUDENT';

  return (
    <div className='flex flex-col gap-8 min-h-[calc(100vh-80px)]'>
      <h1 className='text-2xl text-primary font-bold'>
        {isObserver ? 'Schedule' : 'My Schedule'}
      </h1>
      <div className='flex flex-col gap-3 flex-1'>
        <div className='p-5 bg-white shadow'>
          <div className='flex flex-col md:flex-row md:items-center gap-3'>
            <span className='text-muted-foreground font-bold'>Date:</span>
            <ScheduleDatePicker searchParamsKey='date' />
          </div>
        </div>
        <div className='p-5 shadow bg-white flex-1 flex'>
          {schedules.length === 0 ? (
            <div className='flex items-center justify-center flex-col gap-5 flex-1'>
              <CalendarX2 className='text-muted-foreground h-24 w-24' />
              <div className='flex flex-col gap-1 justify-center items-center'>
                <h3 className='text-primary font-semibold text-xl'>
                  No Schedule
                </h3>
                <p className='text-muted-foreground'>
                  There is no schedule available for{' '}
                  {!searchParams?.date
                    ? 'today'
                    : moment
                        .utc(searchParams.date, 'DD-MM-YYYY')
                        .format('DD MMMM YYYY')}
                  .
                </p>
              </div>
            </div>
          ) : (
            <div className='flex flex-col w-full gap-3'>
              {schedules.map(
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
                    {!isObserver && (
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
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;

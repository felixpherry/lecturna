import { fetchAccountDetail } from '@/lib/actions/account.actions';
import { getNextPeriod, hasSchedule } from '@/lib/actions/period.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';
import AvailabilityForm from './_components/AvailabilityForm';
import { db } from '@/lib/db';
import Image from 'next/image';
import { fetchLogo } from '@/lib/actions/logo.actions';
import moment from 'moment';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  const [userInfo, nextPeriod] = await Promise.all([
    fetchAccountDetail(session.user.id),
    getNextPeriod(),
  ]);

  if (!userInfo || !nextPeriod) return redirect('/not-found');

  const hasScheduleForNextPeriod = await hasSchedule(
    userInfo.id,
    nextPeriod.id
  );

  if (
    session.user.role !== 'INSTRUCTOR' ||
    !nextPeriod ||
    moment(nextPeriod.startDate).diff(moment(new Date()), 'days') > 14 ||
    hasScheduleForNextPeriod
  ) {
    return redirect('/not-found');
  }

  const [days, shifts, courses, logo] = await Promise.all([
    db.masterDay.findMany({
      where: {
        isActive: true,
      },
    }),
    db.masterShift.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    }),
    db.course.findMany({
      where: {
        isPublished: true,
        isDeleted: false,
        program: {
          isPublished: true,
          isDeleted: false,
        },
      },
    }),
    fetchLogo(),
  ]);

  return (
    <main className='flex flex-col justify-center items-center p-5'>
      <Image
        src={logo?.image || '/logo.png'}
        alt='logo'
        height={80}
        width={80}
        className='mt-10'
      />
      <p className='text-xl text-primary font-semibold'>
        Choose your courses and schedule for the next period.
      </p>
      <AvailabilityForm courses={courses} days={days} shifts={shifts} />
    </main>
  );
};

export default Page;

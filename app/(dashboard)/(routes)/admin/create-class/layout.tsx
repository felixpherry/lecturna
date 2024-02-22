import { getNextPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import CreateClassTabs from './_components/CreateClassTabs';

import { StoreInitializer } from './_components/StoreInitializer';
import moment from 'moment';
import GenerateClassButton from './_components/GenerateClassButton';
import { getMappedClassesCount } from './_actions';
import CreateClassButton from './_components/CreateClassButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const nextPeriod = await getNextPeriod();
  if (!nextPeriod) return notFound();

  const studentsCount = await db.studentCourse.count({
    where: {
      periodId: nextPeriod.id,
      classId: null,
      status: 'APPROVED',
    },
  });

  const schedulesCount = await db.instructorSchedule.count({
    where: {
      periodId: nextPeriod.id,
      class: null,
    },
  });

  const instructorSchedules = await db.instructorSchedule.findMany({
    where: {
      class: null,
      periodId: nextPeriod?.id,
    },
    include: {
      day: true,
      shift: true,
      instructor: {
        include: {
          account: true,
          instructorCourses: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  const studentCourses = await db.studentCourse.findMany({
    where: {
      status: 'APPROVED',
      classId: null,
      periodId: nextPeriod?.id,
    },
    include: {
      course: true,
      student: {
        include: {
          account: true,
        },
      },
    },
  });

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

  const mappedClassesCount = await getMappedClassesCount();

  return (
    <>
      <StoreInitializer
        instructorSchedules={instructorSchedules}
        studentCourses={studentCourses}
        courses={courses}
        mappedClassesCount={mappedClassesCount}
      />

      <div className='flex mb-5 flex-col md:flex-row items-center md:justify-between gap-5 w-full'>
        <h3 className='text-muted-foreground text-xl font-semibold'>
          Create Classes for {moment(nextPeriod.startDate).format('MMM')}
          {' - '}
          {moment(nextPeriod.endDate).format('MMM')}{' '}
          {moment(nextPeriod.startDate).format('YYYY')}
        </h3>
        <div className='flex items-center gap-2'>
          <GenerateClassButton />
          <CreateClassButton />
        </div>
      </div>
      <CreateClassTabs
        schedulesCount={schedulesCount}
        studentsCount={studentsCount}
      />
      <div className='bg-white rounded-b-lg shadow-sm'>{children}</div>
    </>
  );
};

export default Layout;

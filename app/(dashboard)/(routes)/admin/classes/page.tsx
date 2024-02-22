import {
  getAllPeriods,
  getCurrentPeriod,
  getNextPeriod,
} from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { MantineSelectOption, SessionInterface } from '@/types';
import { redirect } from 'next/navigation';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { getPublishedCourses } from '@/lib/actions/course.actions';
interface ClassPageParams {
  searchParams: {
    period?: string;
    course?: string;
  };
}

const Page = async ({ searchParams }: ClassPageParams) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session || session.user.role !== 'ADMIN') return redirect('/');

  const currentPeriod = await getCurrentPeriod();

  const classes = await db.class.findMany({
    include: {
      course: true,
      period: true,
      instructorSchedule: {
        include: {
          day: true,
          instructor: {
            include: {
              account: true,
            },
          },
          shift: true,
        },
      },
      schedules: true,
      studentCourses: {
        include: {
          student: {
            include: {
              account: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
    where: {
      periodId: searchParams.period || currentPeriod?.id || undefined,
      courseId: searchParams.course,
    },
  });

  const periods = await getAllPeriods();
  const courses = await getPublishedCourses();

  const courseOptions: MantineSelectOption[] = courses.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const periodOptions: MantineSelectOption[] = periods.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  return (
    <div className='container mx-auto p-0'>
      <div className='flex flex-col gap-5'>
        <h1 className='text-muted-foreground font-bold text-lg'>Classes</h1>
        <DataTable
          columns={columns}
          data={classes}
          courseOptions={courseOptions}
          periodOptions={periodOptions}
          currentPeriodId={currentPeriod?.id || ''}
        />
      </div>
    </div>
  );
};

export default Page;

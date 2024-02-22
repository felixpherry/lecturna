import { getNextPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { convertToTitleCase } from '@/lib/utils';
import { MantineSelectOption } from '@/types';

interface PageProps {
  searchParams: {
    course?: string;
    day?: string;
    shift?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const nextPeriod = await getNextPeriod();

  if (!nextPeriod) return notFound();
  const data = await db.instructorSchedule.findMany({
    where: {
      class: null,
      periodId: nextPeriod?.id,
      dayId: searchParams.day,
      shiftId: searchParams.shift,
      instructor: {
        instructorCourses: {
          some: {
            courseId: searchParams.course,
          },
        },
      },
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

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      isDeleted: false,
      program: {
        isPublished: true,
        isDeleted: false,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const courseOptions: MantineSelectOption[] = courses.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const days = await db.masterDay.findMany({
    where: {
      isActive: true,
    },
  });

  const dayOptions: MantineSelectOption[] = days.map(({ id, day }) => ({
    label: convertToTitleCase(day),
    value: id,
  }));

  const shifts = await db.masterShift.findMany({
    where: {
      isActive: true,
    },
  });

  const shiftOptions: MantineSelectOption[] = shifts.map(
    ({ id, startTime, endTime }) => ({
      label: `${startTime} - ${endTime}`,
      value: id,
    })
  );

  return (
    <div className='container mx-auto py-10'>
      <DataTable
        columns={columns}
        data={data}
        courseOptions={courseOptions}
        dayOptions={dayOptions}
        shiftOptions={shiftOptions}
      />
    </div>
  );
};

export default Page;

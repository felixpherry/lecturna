import { getNextPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { MantineSelectOption } from '@/types';

interface PageProps {
  searchParams: {
    course?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const nextPeriod = await getNextPeriod();
  const data = await db.studentCourse.findMany({
    where: {
      status: 'APPROVED',
      classId: null,
      courseId: searchParams.course,
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
    select: {
      id: true,
      name: true,
    },
  });

  const courseOptions: MantineSelectOption[] = courses.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  return (
    <div className='container mx-auto py-10'>
      <DataTable data={data} columns={columns} courseOptions={courseOptions} />
    </div>
  );
};

export default Page;

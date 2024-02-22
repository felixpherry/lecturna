import { db } from '@/lib/db';
import { RegistrationStatus } from '@prisma/client';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { MantineSelectOption } from '@/types';

interface PageProps {
  searchParams: {
    status?: string;
    course?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const statuses = ['APPROVED', 'PENDING', 'REJECTED'];

  const [data, courses] = await Promise.all([
    db.studentCourse.findMany({
      where: {
        status: statuses.includes(
          searchParams.status?.toLocaleUpperCase() || ''
        )
          ? (searchParams.status?.toLocaleUpperCase() as RegistrationStatus)
          : 'PENDING',
        courseId: searchParams.course,
      },
      include: {
        course: true,
        student: {
          include: {
            account: true,
          },
        },
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
  ]);

  const courseOptions: MantineSelectOption[] = courses.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  return (
    <div className='container mx-auto p-0'>
      <div className='flex flex-col gap-5'>
        <h1 className='text-muted-foreground font-bold text-lg'>Enrollments</h1>
        <DataTable
          columns={columns}
          data={data}
          courseOptions={courseOptions}
        />
      </div>
    </div>
  );
};

export default Page;

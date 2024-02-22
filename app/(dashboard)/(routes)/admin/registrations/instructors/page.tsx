import { db } from '@/lib/db';
import { RegistrationStatus } from '@prisma/client';
import { generateInstructorRegistrationData } from '@/lib/actions/generate.actions';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

interface PageProps {
  searchParams: {
    status?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  // await generateInstructorRegistrationData();
  const statuses = ['APPROVED', 'PENDING', 'REJECTED'];

  const data = await db.instructorRegistration.findMany({
    where: {
      status: statuses.includes(searchParams.status?.toLocaleUpperCase() || '')
        ? (searchParams.status?.toLocaleUpperCase() as RegistrationStatus)
        : 'PENDING',
    },
    include: {
      skills: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Page;

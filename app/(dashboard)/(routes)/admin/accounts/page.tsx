import { db } from '@/lib/db';
import { RegistrationStatus, Role, Status } from '@prisma/client';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

interface PageProps {
  searchParams: {
    role?: string;
    status?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const statuses = ['ACTIVE', 'BANNED'];
  const roles = ['PARENT', 'STUDENT', 'INSTRUCTOR', 'ADMIN'];

  const data = await db.account.findMany({
    where: {
      role: roles.includes(searchParams.role?.toLocaleUpperCase() || '')
        ? (searchParams.role?.toLocaleUpperCase() as Role)
        : undefined,
      status: statuses.includes(searchParams.status?.toLocaleUpperCase() || '')
        ? (searchParams.status?.toLocaleUpperCase() as Status)
        : undefined,
    },
  });

  return (
    <div className='container mx-auto p-0'>
      <div className='flex flex-col gap-5'>
        <h1 className='text-muted-foreground font-bold text-lg'>Accounts</h1>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Page;

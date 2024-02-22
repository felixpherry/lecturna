import { db } from '@/lib/db';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

interface PageProps {
  searchParams?: {
    status: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  let isActive: boolean | undefined = true;
  if (searchParams?.status?.toLocaleLowerCase() === 'inactive')
    isActive = false;
  else if (searchParams?.status?.toLocaleLowerCase() === 'all')
    isActive = undefined;

  const grades = await db.masterGrade.findMany({
    orderBy: {
      minScore: 'asc',
    },
    where: {
      isActive,
    },
  });

  return (
    <div className='container mx-auto p-0'>
      <div className='flex flex-col gap-5'>
        <h1 className='text-muted-foreground font-bold text-lg'>
          Master Grade
        </h1>
        <DataTable columns={columns} data={grades} />
      </div>
    </div>
  );
};

export default Page;

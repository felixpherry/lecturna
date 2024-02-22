import { db } from '@/lib/db';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

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

  const skills = await db.skill.findMany({
    orderBy: {
      name: 'asc',
    },
    where: {
      isActive,
    },
  });

  return (
    <div className='container mx-auto p-0'>
      <div className='flex flex-col gap-5'>
        <h1 className='text-muted-foreground font-bold text-lg'>
          Master Skill
        </h1>
        <DataTable columns={columns} data={skills} />
      </div>
    </div>
  );
};

export default Page;

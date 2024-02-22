import { db } from '@/lib/db';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const Page = async () => {
  const faq = await db.faq.findMany({
    orderBy: {
      question: 'asc',
    },
  });

  return (
    <DataTable
      columns={columns}
      data={faq}
    />
  );
};

export default Page;

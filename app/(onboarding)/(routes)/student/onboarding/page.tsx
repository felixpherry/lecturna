import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { notFound } from 'next/navigation';
import StudentOnboardingStepper from './_components/StudentOnboardingStepper';
import { Account, Student } from '@prisma/client';
import StoreInitializer from './_components/StoreInitializer';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  if (!session) return notFound();

  const data = (await db.account.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      student: true,
    },
  })) as {
    student: Student;
  } & Account;

  if (!data || !data.student) return notFound();

  return (
    <div className='flex flex-col gap-3 w-full max-w-3xl'>
      <StoreInitializer data={data} />
      <StudentOnboardingStepper />
    </div>
  );
};

export default Page;

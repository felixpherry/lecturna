import CreateProgramForm from '@/app/(dashboard)/_components/CreateProgramForm';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  return (
    <>
      <CreateProgramForm session={session} />
    </>
  );
};

export default Page;

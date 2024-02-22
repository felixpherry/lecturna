import { fetchAccountDetail } from '@/lib/actions/account.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import ParentOnboardingForm from './_components/ParentOnboardingForm';
import { notFound } from 'next/navigation';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;

  const userInfo = await fetchAccountDetail(session?.user.id);

  if (!userInfo) return notFound();

  return (
    <div className='flex flex-col gap-3 w-full max-w-3xl'>
      <div className='flex flex-col gap-3 justify-center items-center p-10'>
        <h3 className='font-bold text-4xl'>Welcome to Lecturna</h3>
        <p className='font-lg text-muted-foreground'>
          Please provide your essential details to get started with the app.
        </p>
        <ParentOnboardingForm initialData={userInfo} />
      </div>
    </div>
  );
};

export default Page;

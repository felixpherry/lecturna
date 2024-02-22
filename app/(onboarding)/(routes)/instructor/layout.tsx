import { fetchAccountDetail } from '@/lib/actions/account.actions';
import { fetchLogo } from '@/lib/actions/logo.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import Image from 'next/image';
import { redirect } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

const InstructorLayout = async ({ children }: Props) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (session?.user.role !== 'INSTRUCTOR') return redirect('/not-found');

  const userInfo = await fetchAccountDetail(session.user.id);

  if (userInfo?.onboarded) return redirect('/instructor/dashboard');

  const logo = await fetchLogo();

  return (
    <main className='flex flex-col justify-center items-center p-5'>
      <Image
        src={logo?.image || '/logo.png'}
        alt='logo'
        height={80}
        width={80}
        className='mt-10'
      />
      {children}
    </main>
  );
};

export default InstructorLayout;

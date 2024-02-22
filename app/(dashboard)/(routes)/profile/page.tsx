import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  if (!session) return redirect('/login');

  return redirect(`/profile/${session.user.id}`);
};

export default Page;

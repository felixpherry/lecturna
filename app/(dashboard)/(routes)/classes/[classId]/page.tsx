import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';
import { getClassTabs } from '../_utils';

interface PageProps {
  params: { classId: string };
}

const Page = async ({ params: { classId } }: PageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;
  if (!session) return redirect('/not-found');

  const redirectUrl = getClassTabs(session.user.role, classId)[0].href;
  if (!redirectUrl) return redirect('/not-found');
  return redirect(redirectUrl);
};

export default Page;

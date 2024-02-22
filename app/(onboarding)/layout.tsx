import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { redirect } from 'next/navigation';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

const OnboardingLayout = async ({ children }: OnboardingLayoutProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  return <>{children}</>;
};

export default OnboardingLayout;

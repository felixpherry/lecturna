import Navbar from '@/app/(landing)/_components/Navbar';
import Footer from '@/app/(landing)/_components/Footer';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { fetchLogo } from '@/lib/actions/logo.actions';
import MobileMenu from './_components/MobileMenu';
// import Seed from '@/components/Seed';

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout = async ({ children }: LandingLayoutProps) => {
  const session = (await getCurrentUser()) as SessionInterface;
  const logo = await fetchLogo();

  return (
    <>
      <Navbar session={session} logo={logo!} mobileMenu={<MobileMenu />} />
      <main>{children}</main>
      <Footer logo={logo!} />
    </>
  );
};

export default LandingLayout;

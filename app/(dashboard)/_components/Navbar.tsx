import NavbarRoutes from '@/components/shared/NavbarRoutes';
import MobileSidebar from './MobileSidebar';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';

const Navbar = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  return (
    <div className='p-5 border-b h-full flex items-center bg-white shadow-sm'>
      <MobileSidebar session={session} />
      <NavbarRoutes session={session} />
    </div>
  );
};

export default Navbar;

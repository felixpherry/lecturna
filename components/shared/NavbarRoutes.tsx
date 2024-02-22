import { getCurrentUser } from '@/lib/session';
import ProfileMenu from './ProfileMenu';
import { SessionInterface } from '@/types';

interface NavbarRoutesProps {
  session: SessionInterface;
}

const NavbarRoutes = async ({ session }: NavbarRoutesProps) => {
  return (
    <div className='flex-gap-x-2 ml-auto'>
      <ProfileMenu session={session} />{' '}
    </div>
  );
};

export default NavbarRoutes;

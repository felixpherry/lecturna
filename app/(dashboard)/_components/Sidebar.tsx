import { ScrollArea } from '@mantine/core';

import Logo from './Logo';
import SidebarRoutes from './SidebarRoutes';
import { SessionInterface } from '@/types';
import Link from 'next/link';

const Sidebar = ({ session }: { session: SessionInterface }) => {
  return (
    <nav className='bg-white p-4 pt-0 flex flex-col border-r shadow-sm h-full w-full'>
      <div className='p-4 -mx-4 h-20'>
        <div className='flex justify-between items-center'>
          <Link href='/' className='flex gap-2 items-center'>
            <Logo />
          </Link>
        </div>
      </div>

      <ScrollArea className='flex-1 -mx-4 no-scrollbar'>
        <SidebarRoutes session={session} />
      </ScrollArea>
    </nav>
  );
};

export default Sidebar;

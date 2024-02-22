import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { SessionInterface } from '@/types';

interface MobileSidebarInterface {
  session: SessionInterface;
}

const MobileSidebar = ({ session }: MobileSidebarInterface) => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden py-2 px-4 rounded-lg hover:bg-accent hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-white w-72'>
        <Sidebar session={session} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;

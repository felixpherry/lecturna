import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import MobileMenuRoutes from './MobileMenuRoutes';
import Logo from '@/app/(dashboard)/_components/Logo';

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden py-2 px-4 rounded-lg hover:bg-accent hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-white w-72'>
        <nav className='bg-white p-4 pt-0 flex flex-col border-r shadow-sm h-full w-full'>
          <div className='p-4 -mx-4 h-20'>
            <div className='flex justify-between items-center'>
              <div className='flex gap-2 items-center'>
                <Logo />
                <div className='font-fabada text-primary-blue text-xl font-semibold'>
                  Lecturna
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className='flex-1 -mx-4 no-scrollbar'>
            <MobileMenuRoutes />
          </ScrollArea>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

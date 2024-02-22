'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NavLinks } from '@/constants';
import ProfileMenu from '../../../components/shared/ProfileMenu';
import { SessionInterface } from '@/types';
import { Button } from '../../../components/ui/button';
import { LogIn, UserCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  session: SessionInterface;
  logo: {
    image: string;
  };
  mobileMenu: JSX.Element;
}

const Navbar = ({ session, logo, mobileMenu }: NavbarProps) => {
  const [scroll, setScroll] = useState(false);

  const pathname = usePathname()!;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'navbar',
        scroll &&
          'fixed top-0 left-1/2 z-[80] -translate-x-1/2 shadow-xl animate-navbar-down'
      )}
    >
      <div className={'flexBetween container max-w-7xl p-0'}>
        <div className='flex-1 flexStart gap-10'>
          <div className='flex items-center gap-3'>
            {mobileMenu}
            <Link href='/' className='flex items-center'>
              <Image
                className='mr-3'
                src={logo?.image || '/logo.png'}
                width={50}
                height={50}
                alt='Lecturna'
                priority={true}
              />
            </Link>
          </div>
          <ul className='md:flex hidden text-sm gap-7'>
            {NavLinks.map((link) => {
              const isActive =
                (pathname === '/' && link.href === '/') ||
                pathname === link.href ||
                pathname?.startsWith(`${link.href}/`);
              return (
                <li
                  key={link.key}
                  className='hover:text-primary-blue hover:scale-110 transition !duration-500 font-semibold'
                >
                  <Link
                    href={link.href}
                    className={cn(isActive && 'text-primary-blue')}
                  >
                    {link.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className='flexCenter gap-4 ml-auto'>
          {session?.user ? (
            <ProfileMenu session={session} />
          ) : (
            <>
              <Button variant='primary-blue-outline' asChild>
                <Link
                  href='/login'
                  className='hidden md:inline-flex !rounded-full text-sm font-semibold'
                >
                  <UserCircle2 />
                  Masuk
                </Link>
              </Button>
              <Link href='/login' className='block md:hidden text-primary-blue'>
                <LogIn />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

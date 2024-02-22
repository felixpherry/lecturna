'use client';

import { signOut } from 'next-auth/react';

import { LogOut, User } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SessionInterface } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export const ProfileMenu = ({ session }: { session: SessionInterface }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-8 rounded-full'>
        <span className='relative flex shrink-0 overflow-hidden rounded-full h-10 w-10'>
          <Image
            src={session.user?.image || '/avatar-fallback.svg'}
            height={40}
            width={40}
            alt='profile image'
            className='aspect-square h-full w-full'
          />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 mr-8'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href='/profile'>
            <DropdownMenuItem>
              <User className='mr-2 h-4 w-4' />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;

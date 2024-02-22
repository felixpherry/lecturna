'use client';

import { NavLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { Box, Group } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileMenuRoutes = () => {
  const pathname = usePathname()!;
  return (
    <div className='py-8'>
      {NavLinks.map(({ href, icon: Icon, key, text }) => {
        const isActive =
          (pathname === '/' && href === '/') ||
          pathname === href ||
          pathname?.startsWith(`${href}/`);
        return (
          <Link
            key={key}
            href={href}
            className={cn(
              'font-medium block w-full !py-[10px] !px-4 text-primary hover:bg-slate-200/20',
              isActive &&
                'text-primary-blue bg-sky-200/20 hover:bg-sky-200/20 hover:text-primary-blue'
            )}>
            <Group
              justify='space-between'
              gap={0}>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  className={cn(
                    'text-primary-blue w-8 h-8 rounded-sm flex justify-center items-center',
                    isActive ? 'bg-transparent' : 'bg-sky-200/20'
                  )}>
                  <Icon className='w-4 h-4' />
                </div>
                <Box ml='md'>{text}</Box>
              </Box>
            </Group>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileMenuRoutes;

'use client';

import { useState } from 'react';
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface SidebarItemProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; href: string }[];
  href?: string;
}

const SidebarItem = ({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  href,
}: SidebarItemProps) => {
  const hasLinks = Array.isArray(links);

  const [opened, setOpened] = useState(initiallyOpened || false);

  const pathname = usePathname()!;

  const isActive =
    (pathname === '/' && href === '/') ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  return (
    <>
      {!href ? (
        <>
          <UnstyledButton
            onClick={() => setOpened((o) => !o)}
            className='font-medium block w-full !py-[10px] !px-4 text-primary hover:bg-slate-200/20'>
            <Group
              className='flex justify-between items-center gap-0'
              unstyled>
              <Box className='flex items-center'>
                <div className='text-primary-blue w-8 h-8 rounded-sm flex justify-center items-center bg-sky-200/20'>
                  <Icon className='w-4 h-4' />
                </div>
                <Box ml='md'>{label}</Box>
              </Box>

              <IconChevronRight
                className={cn(
                  'transition-transform duration-200 ease-linear w-4 h-4 stroke-[1.5]',
                  opened && 'rotate-90'
                )}
              />
            </Group>
          </UnstyledButton>
          <Collapse in={opened}>
            {(hasLinks ? links : []).map((link) => {
              const isActive =
                (pathname === '/' && link.href === '/') ||
                pathname === link.href ||
                pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  className={cn(
                    'font-medium block py-[10px] px-4 ml-8 text-sm text-muted-foreground border-l hover:text-primary hover:bg-slate-200/20',
                    isActive &&
                      'text-primary-blue bg-sky-200/20 hover:bg-sky-200/20 hover:text-primary-blue border-primary-blue'
                  )}
                  href={link.href}
                  key={link.label}>
                  {link.label}
                </Link>
              );
            })}
          </Collapse>
        </>
      ) : (
        <Link
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
              <Box ml='md'>{label}</Box>
            </Box>
          </Group>
        </Link>
      )}
    </>
  );
};

export default SidebarItem;

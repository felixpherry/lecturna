'use client';

import { cn } from '@/lib/utils';
import { BookUser, CalendarSearch, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCreateClassStore } from '../_stores/use-create-class-store';

interface CreateClassTabsProps {
  studentsCount: number;
  schedulesCount: number;
}

const CreateClassTabs = ({
  studentsCount,
  schedulesCount,
}: CreateClassTabsProps) => {
  const pathname = usePathname()!;
  const mappedClasses = useCreateClassStore((state) => state.mappedClasses);

  const tabs = [
    {
      icon: GraduationCap,
      name: 'Students',
      href: '/admin/create-class/students',
      count: studentsCount,
    },
    {
      icon: CalendarSearch,
      name: 'Schedules',
      href: '/admin/create-class/schedules',
      count: schedulesCount,
    },
    {
      icon: BookUser,
      name: 'Results',
      href: '/admin/create-class/results',
      count: mappedClasses.length,
    },
  ];

  return (
    <div className='bg-transparent flex justify-start items-center gap-3 flex-wrap'>
      {tabs.map(({ href, icon: Icon, name, count }) => {
        const active = pathname
          .toLocaleLowerCase()
          .includes(href.toLocaleLowerCase());

        return (
          <Link key={name} href={href}>
            <div
              className={cn(
                'flex rounded-t-lg py-3 px-5 gap-3 items-center',
                active ? 'bg-white' : 'bg-[#E4EEFC]'
              )}
            >
              <Icon className='w-4 h-4 lg:w-6 lg:h-6' />
              <span className='font-semibold text-primary hidden md:block'>
                {name}
              </span>
              <span
                className={cn(
                  'px-2 text-[10px] rounded-full font-medium',
                  active
                    ? 'bg-primary-blue text-white'
                    : 'bg-[#9CC2F6] text-primary'
                )}
              >
                {count}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CreateClassTabs;

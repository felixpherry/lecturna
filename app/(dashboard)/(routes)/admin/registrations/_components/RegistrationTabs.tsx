'use client';

import { cn } from '@/lib/utils';
import { GraduationCap, List, Presentation } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface RegistrationTabsProps {
  trialClassCount: number;
  courseRegistrationCount: number;
  instructorRegistrationCount: number;
}

const RegistrationTabs = ({
  courseRegistrationCount,
  instructorRegistrationCount,
  trialClassCount,
}: RegistrationTabsProps) => {
  const pathname = usePathname()!;

  const tabs = [
    {
      icon: List,
      name: 'Trial Class',
      href: '/admin/registrations/trial-class',
      count: trialClassCount,
    },
    {
      icon: GraduationCap,
      name: 'Courses',
      href: '/admin/registrations/courses',
      count: courseRegistrationCount,
    },
    {
      icon: Presentation,
      name: 'Instructors',
      href: '/admin/registrations/instructors',
      count: instructorRegistrationCount,
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

export default RegistrationTabs;

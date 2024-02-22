'use client';

import ActionTooltip from '@/components/shared/ActionTooltip';
import { cn } from '@/lib/utils';
import { SessionInterface } from '@/types';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { getClassTabs } from '../../_utils';

interface ClassDetailTabsProps {
  classId: string;
  session: SessionInterface;
}

const ClassDetailTabs = ({ classId, session }: ClassDetailTabsProps) => {
  const pathname = usePathname()!;
  if (!session) return redirect('/login');

  const tabs = getClassTabs(session.user.role, classId);

  return (
    <div className='flex items-center'>
      {tabs.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'p-3 flex items-center justify-center text-sm flex-1',
            pathname.includes(href)
              ? 'bg-primary-blue text-white'
              : 'bg-secondary text-muted-foreground'
          )}
        >
          <span className='hidden md:block'>{label}</span>
          <ActionTooltip label={label}>
            <Icon className='block md:hidden h-4 w-4' />
          </ActionTooltip>
        </Link>
      ))}
    </div>
  );
};

export default ClassDetailTabs;

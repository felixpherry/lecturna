'use client';

import { cn } from '@/lib/utils';
import { Chrome, FileQuestion, Layout, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutTab {
  label: string;
  url: string;
  icon: LucideIcon;
}

const LayoutTabs = () => {
  const tabs: LayoutTab[] = [
    {
      label: 'Hero',
      url: '/admin/layouts/hero',
      icon: Layout,
    },
    {
      label: 'FAQ',
      url: '/admin/layouts/faq',
      icon: FileQuestion,
    },
    {
      label: 'Logo',
      url: '/admin/layouts/logo',
      icon: Chrome,
    },
  ];

  const pathname = usePathname()!;
  return (
    <div className='p-5 bg-white flex flex-col gap-0 w-full md:w-52 shadow'>
      {tabs.map(({ icon: Icon, label, url }) => (
        <Link
          key={label}
          href={url}
          className={cn(
            'flex items-center gap-2 p-3 rounded-[5px]',
            pathname.includes(url)
              ? 'bg-primary-blue text-white'
              : 'text-zinc-600 hover:bg-sky-200/20'
          )}
        >
          <Icon className='h-4 w-4' />
          {label}
        </Link>
      ))}
    </div>
  );
};

export default LayoutTabs;

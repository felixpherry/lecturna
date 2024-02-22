'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const CourseSearchBox = () => {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const pathname = usePathname()!;
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const searchCourses = () => {
      const params = new URLSearchParams(searchParams);
      !search ? params.delete('search') : params.set('search', search);

      router.push(pathname + '?' + params.toString(), {
        scroll: false,
      });
    };
    const fn = setTimeout(searchCourses, 1000);
    return () => clearTimeout(fn);
  }, [pathname, router, search, searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className='md:col-span-2 lg:col-start-1 lg:col-end-3 bg-light-white-300 flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 flex-1'>
      <Search className=' text-slate-500 cursor-pointer h-8 w-8' />
      <input
        type='text'
        value={search}
        onChange={handleSearch}
        className='flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none border-none shadow-none outline-none'
        placeholder='Cari kursus...'
      />
    </div>
  );
};

export default CourseSearchBox;

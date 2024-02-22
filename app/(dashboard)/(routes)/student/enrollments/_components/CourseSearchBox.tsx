'use client';

import { Input } from '@mantine/core';
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
    <Input
      placeholder='Search course...'
      value={search}
      onChange={handleSearch}
    />
  );
};

export default CourseSearchBox;

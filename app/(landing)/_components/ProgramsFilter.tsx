'use client';

import { Badge } from '@/components/ui/badge';
import { Category } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface ProgramsFilterProps {
  categories: Category[];
}

const ProgramsFilter = ({ categories }: ProgramsFilterProps) => {
  const router = useRouter();
  const pathname = usePathname()!;
  const searchParams = useSearchParams()!;

  const [category, setCategory] = useState(
    searchParams.get('category') || null
  );

  const handleFilter = (newCategory: string) => {
    const params = new URLSearchParams(searchParams);
    setCategory(newCategory);
    params.set('category', newCategory);

    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  const deleteFilter = () => {
    setCategory(null);
    const params = new URLSearchParams(searchParams);
    params.delete('category');

    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  return (
    <div className='flex justify-center gap-3 flex-wrap mt-8'>
      <Badge
        onClick={deleteFilter}
        variant={category ? 'filter-badge' : 'filter-badge-active'}
        className='p-3 cursor-pointer'
      >
        Semua Kategori
      </Badge>
      {categories.map(({ id, ageDescription }) => (
        <Badge
          key={id}
          onClick={() => handleFilter(id)}
          variant={category === id ? 'filter-badge-active' : 'filter-badge'}
          className='p-3 cursor-pointer'
        >
          {ageDescription}
        </Badge>
      ))}
    </div>
  );
};

export default ProgramsFilter;

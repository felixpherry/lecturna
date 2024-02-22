'use client';

import { Badge } from '@/components/ui/badge';
import { Program } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface CourseProgramBadgesProps {
  programs: Program[];
}

const CourseProgramBadges = ({ programs }: CourseProgramBadgesProps) => {
  const router = useRouter();
  const pathname = usePathname()!;
  const searchParams = useSearchParams()!;

  const [program, setProgram] = useState(searchParams.get('program') || null);

  const handleFilter = (newProgram: string) => {
    const params = new URLSearchParams(searchParams);
    setProgram(newProgram);
    params.set('program', newProgram);

    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  const deleteFilter = () => {
    setProgram(null);
    const params = new URLSearchParams(searchParams);
    params.delete('program');

    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  return (
    <div className='flex gap-3 flex-wrap mt-8'>
      <Badge
        onClick={deleteFilter}
        variant={program ? 'filter-badge' : 'filter-badge-active'}
        className='p-3 cursor-pointer'
      >
        Semua Program
      </Badge>
      {programs.map(({ id, name }) => (
        <Badge
          key={id}
          onClick={() => handleFilter(id)}
          variant={program === id ? 'filter-badge-active' : 'filter-badge'}
          className='p-3 cursor-pointer'
        >
          {name}
        </Badge>
      ))}
    </div>
  );
};

export default CourseProgramBadges;

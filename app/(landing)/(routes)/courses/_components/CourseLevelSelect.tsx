'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const CourseLevelSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const pathname = usePathname()!;
  const [level, setLevel] = useState(searchParams.get('level') || undefined);

  const handleFilter = (newLevel: string) => {
    setLevel(newLevel);
    const params = new URLSearchParams(searchParams);
    !newLevel ? params.delete('level') : params.set('level', newLevel);
    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };

  return (
    <Select value={level} onValueChange={handleFilter}>
      <SelectTrigger className='col-span-1 w-full min-h-[56px] focus:outline-none active:outline-none text-slate-500 text-medium font-semibold shadow-md'>
        <SelectValue placeholder='Pilih Tingkatan' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='' className='font-semibold'>
            Semua Tingkatan
          </SelectItem>
          <SelectItem value='beginner'>Beginner</SelectItem>
          <SelectItem value='intermediate'>Intermediate</SelectItem>
          <SelectItem value='advanced'>Advanced</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CourseLevelSelect;

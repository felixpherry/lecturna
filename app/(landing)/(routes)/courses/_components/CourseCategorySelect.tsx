'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface CourseCategorySelectProps {
  categories: Category[];
}

const CourseCategorySelect = ({ categories }: CourseCategorySelectProps) => {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const pathname = usePathname()!;
  const [category, setCategory] = useState(
    searchParams.get('category') || undefined
  );
  const handleFilter = (newCategory: string) => {
    setCategory(newCategory);
    const params = new URLSearchParams(searchParams);
    !newCategory
      ? params.delete('category')
      : params.set('category', newCategory);
    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  };
  return (
    <Select value={category} onValueChange={handleFilter}>
      <SelectTrigger className='col-span-1 w-full min-h-[56px] focus:outline-none active:outline-none text-slate-500 text-medium font-semibold shadow-md'>
        <SelectValue placeholder='Pilih Kategori' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='' className='font-semibold'>
            Semua Kategori
          </SelectItem>
          {categories.map(({ id, ageDescription }) => (
            <SelectItem key={id} value={id}>
              {ageDescription}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CourseCategorySelect;

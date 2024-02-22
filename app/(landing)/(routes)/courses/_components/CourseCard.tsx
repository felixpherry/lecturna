import Preview from '@/components/shared/Preview';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SessionInterface } from '@/types';

import { Course } from '@prisma/client';
import { CalendarDays, Dot } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
  course: {
    _count: {
      sessions: number;
    };
    category: {
      ageDescription: string;
    } | null;
  } & Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { id, image, name, _count, category, description, level } = course;

  const badgeColor = {
    BEGINNER: 'bg-green-500',
    INTERMEDIATE: 'bg-blue-600',
    ADVANCED: 'bg-red-600',
  };

  return (
    <>
      <Card className='shadow-lg hover:shadow-2xl' key={id}>
        <CardContent className='overflow-visible p-0'>
          <div className='relative'>
            <div className='card-image_shadow absolute h-full w-full top-0 left-0 rounded-tr-lg z-20' />
            <Image
              width={480}
              height={140}
              alt={name}
              className='w-full object-cover h-[240px] rounded-t-lg relative'
              src={image || ''}
            />
            <span
              className={cn(
                'absolute p-3 top-3 text-xs right-3 text-white font-semibold rounded-lg z-50',
                badgeColor[level ?? 'BEGINNER']
              )}
            >
              {level}
            </span>
          </div>
          <div className='px-6 mt-4'>
            <h3 className='text-2xl font-semibold'>
              <Link href={`/courses/${id}`}>{name}</Link>
            </h3>
            <div className='flex flex-start items-center gap-1 text-sm text-muted-foreground mt-2'>
              <div className='flex items-center gap-1'>
                <CalendarDays className='w-4 h-4 text-primary-blue' />
                <span>{_count.sessions} sesi</span>
              </div>
              <div className='flex items-center gap-1'>
                <Dot className='w-5 h-5 text-primary-blue' />
                <span>{category?.ageDescription}</span>
              </div>
            </div>
          </div>
          <span className='text-sm text-muted-foreground'>
            <Preview
              value={description || ''}
              className='[&_p]:line-clamp-3 px-6 my-3'
            />
          </span>
        </CardContent>
        <CardFooter className='text-sm justify-between gap-3 pb-5 px-5'>
          <Button
            variant='primary-blue'
            size='sm'
            asChild
            className='w-1/2 text-sm'
          >
            <Link href={`/courses/${id}/register`}>Daftar</Link>
          </Button>
          <Button
            variant='primary-blue-outline'
            size='sm'
            asChild
            className='w-1/2 text-sm'
          >
            <Link href={`/courses/${id}`}>Lihat Detail</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default CourseCard;

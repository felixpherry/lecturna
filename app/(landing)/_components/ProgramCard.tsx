import Preview from '@/components/shared/Preview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Program } from '@prisma/client';
import { Code2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProgramCardProps {
  program: {
    _count: {
      courses: number;
    };
  } & Program;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  const { id, image, description, name, _count } = program;
  return (
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
        </div>
        <div className='px-6 mt-4'>
          <h3 className='text-2xl font-semibold'>
            <Link href={`/programs/${id}`}>{name}</Link>
          </h3>
          <div className='flex items-center gap-2 text-lg text-muted-foreground mt-2'>
            <Code2 className='w-6 h-6 text-primary-blue' />
            <span>{_count.courses} kursus</span>
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
          variant='primary-blue-outline'
          size='sm'
          asChild
          className='w-full text-sm'
        >
          <Link href={`/programs/${id}`}>Lihat Detail</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;

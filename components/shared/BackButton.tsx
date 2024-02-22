'use client';

import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      size='sm'
      variant='ghost'
      className='w-fit'>
      <ChevronLeft className='w-4 h-4' />
      Back
    </Button>
  );
};

export default BackButton;

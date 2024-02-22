'use client';

import { seedData } from '@/lib/actions/generate.actions';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const Seed = () => {
  const initialized = useRef(false);

  useEffect(() => {
    const handleSeed = async () => {
      if (!initialized.current) {
        await seedData();
        initialized.current = true;
      }
    };
    handleSeed().catch((error) => toast.error(error));
  }, []);
  return null;
};

export default Seed;

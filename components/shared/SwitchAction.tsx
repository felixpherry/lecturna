'use client';

import { Switch, rem, useMantineTheme } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';

interface SwitchActionProps<T> {
  active: boolean;
  onChange: (checked: boolean) => Promise<T>;
}

export default function SwitchAction<T>({
  active,
  onChange,
}: SwitchActionProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useMantineTheme();

  const handleSwitch = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      await onChange(e.currentTarget.checked);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader2 className='h-6 w-6 animate-spin' />
      ) : (
        <Switch
          checked={active}
          onChange={handleSwitch}
          color='teal'
          size='md'
          thumbIcon={
            active ? (
              <IconCheck
                style={{ width: rem(12), height: rem(12) }}
                color={theme.colors.teal[6]}
                stroke={3}
              />
            ) : (
              <IconX
                style={{ width: rem(12), height: rem(12) }}
                color={theme.colors.red[6]}
                stroke={3}
              />
            )
          }
        />
      )}
    </>
  );
}

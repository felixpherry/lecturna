'use client';

import { DateInput } from '@mantine/dates';
import moment from 'moment';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ScheduleDatePickerProps {
  searchParamsKey: string;
}

const ScheduleDatePicker = ({ searchParamsKey }: ScheduleDatePickerProps) => {
  const searchParams = useSearchParams()!;
  const [date, setDate] = useState<Date | null>(
    moment.utc(searchParams?.get(searchParamsKey), 'DD-MM-YYYY').isValid()
      ? moment.utc(searchParams?.get(searchParamsKey), 'DD-MM-YYYY').toDate()
      : new Date()
  );

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (!date) params.delete(searchParamsKey);
    else if (moment(date).isValid())
      params.set(searchParamsKey, moment(date).format('DD-MM-YYYY'));
    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
  }, [date, router, pathname, searchParams, searchParamsKey]);

  return (
    <DateInput
      value={date}
      onChange={setDate}
      placeholder='Date input'
      valueFormat='DD MMM YYYY'
      clearable
      unselectable='on'
    />
  );
};

export default ScheduleDatePicker;

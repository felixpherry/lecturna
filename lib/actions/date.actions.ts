'use server';

import { DateTime } from 'luxon';

export const getServerDate = () => {
  return DateTime.utc().setZone('UTC-7', { keepLocalTime: true }).toJSDate();
};

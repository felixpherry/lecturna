'use server';

import { getNextPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';

export const fetchCurrentClassesGroupByCourseId = async () => {
  try {
    const nextPeriod = await getNextPeriod();

    if (!nextPeriod) return [];
    const classes = await db.class.groupBy({
      by: 'courseId',
      _max: {
        name: true,
      },
      where: {
        periodId: nextPeriod.id,
      },
    });

    return classes;
  } catch (error: any) {
    throw new Error(`Failed to fetch current classes: ${error.message}`);
  }
};

export const getMappedClassesCount = async (): Promise<
  Record<string, number>
> => {
  const classes = await fetchCurrentClassesGroupByCourseId();
  return classes.reduce((curr, { _max, courseId }) => {
    curr[courseId] = parseInt(_max.name?.slice(3) || '0') || 0;
    return curr;
  }, {} as Record<string, number>);
};

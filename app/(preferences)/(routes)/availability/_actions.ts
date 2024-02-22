'use server';

import { db } from '@/lib/db';
import { InstructorSchedule } from './_components/AvailabilityForm';
import { getNextPeriod } from '@/lib/actions/period.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';

interface SaveInstructorAvailabilityParams {
  instructorCourses: string[];
  instructorSchedules: InstructorSchedule[];
}

export const saveInstructorAvailability = async ({
  instructorCourses,
  instructorSchedules,
}: SaveInstructorAvailabilityParams) => {
  try {
    const nextPeriod = await getNextPeriod();
    if (!nextPeriod) throw new Error('No next period');

    const session = (await getCurrentUser()) as SessionInterface;
    if (!session) throw new Error('Unauthorized');

    const instructor = await db.instructor.update({
      where: { accountId: session.user.id },
      data: {
        instructorCourses: {
          createMany: {
            data: instructorCourses.map((courseId) => ({
              courseId,
              periodId: nextPeriod.id,
            })),
            skipDuplicates: true,
          },
        },
        instructorSchedules: {
          createMany: {
            data: instructorSchedules.map(({ dayId, shiftId }) => ({
              dayId,
              periodId: nextPeriod.id,
              shiftId,
            })),
            skipDuplicates: true,
          },
        },
      },
    });

    return instructor;
  } catch (error: any) {
    console.log('saveInstructorAvailability', error.message);
    throw new Error(error.message);
  }
};

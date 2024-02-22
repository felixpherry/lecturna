'use server';

import { getChildAccountId } from '@/lib/actions/parent.actions';
import { db } from '@/lib/db';

export const getInstructorSchedule = async (accountId: string, date: Date) => {
  try {
    return await db.schedule.findMany({
      where: {
        class: {
          instructorSchedule: {
            instructor: {
              accountId,
            },
          },
        },
        scheduleDate: date,
      },
      include: {
        class: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        scheduleTime: 'asc',
      },
    });
  } catch (error: any) {
    console.log('getInstructorSchedule', error.message);
    throw new Error(error.message);
  }
};

export const getStudentSchedule = async (accountId: string, date: Date) => {
  try {
    return await db.schedule.findMany({
      where: {
        class: {
          studentCourses: {
            some: {
              student: {
                accountId,
              },
            },
          },
        },
        scheduleDate: date,
      },
      include: {
        class: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        scheduleTime: 'asc',
      },
    });
  } catch (error: any) {
    console.log('getStudentSchedule', error.message);
    throw new Error(error.message);
  }
};

export const getParentSchedule = async (accountId: string, date: Date) => {
  try {
    const childAccountId = await getChildAccountId(accountId);

    if (!childAccountId) throw new Error("Child's account not found");

    return await getStudentSchedule(childAccountId, date);
  } catch (error: any) {
    console.log('getParentSchedule', error.message);
    throw new Error(error.message);
  }
};

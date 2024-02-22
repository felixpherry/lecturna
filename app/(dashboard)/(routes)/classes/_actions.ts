'use server';

import { getChildAccountId } from '@/lib/actions/parent.actions';
import { db } from '@/lib/db';

export const getInstructorClasses = async (
  accountId: string,
  periodId: string | undefined
) => {
  try {
    return await db.class.findMany({
      where: {
        instructorSchedule: {
          instructor: {
            accountId,
          },
        },
        periodId,
      },
      include: {
        course: true,
        period: true,
        schedules: true,
        instructorSchedule: {
          include: {
            instructor: {
              include: {
                account: true,
              },
            },
          },
        },
        _count: {
          select: {
            studentCourses: true,
          },
        },
      },
    });
  } catch (error: any) {
    console.log('getInstructorClasses', error.message);
    throw new Error(error.message);
  }
};

export const getStudentClasses = async (
  accountId: string,
  periodId: string | undefined
) => {
  try {
    return await db.class.findMany({
      where: {
        studentCourses: {
          some: {
            student: {
              accountId,
            },
          },
        },
        periodId: periodId,
      },
      include: {
        course: true,
        period: true,
        schedules: true,
        instructorSchedule: {
          include: {
            instructor: {
              include: {
                account: true,
              },
            },
          },
        },
        _count: {
          select: {
            studentCourses: true,
          },
        },
      },
    });
  } catch (error: any) {
    console.log('getStudentClasses', error.message);
    throw new Error(error.message);
  }
};

export const getParentClasses = async (
  accountId: string,
  periodId: string | undefined
) => {
  try {
    const childAccountId = await getChildAccountId(accountId);

    if (!childAccountId) throw new Error("Child's account not found");
    return await getStudentClasses(childAccountId, periodId);
  } catch (error: any) {
    console.log('getParentClasses', error.message);
    throw new Error(error.message);
  }
};

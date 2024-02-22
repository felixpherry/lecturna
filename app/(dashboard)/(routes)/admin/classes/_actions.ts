'use server';

import { getNextPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { ClassTableInterface } from './_components/columns';
import { revalidatePath } from 'next/cache';
import { ServerActionsResponse } from '@/types';
import { Class } from '@prisma/client';

export const getAvailableInstructors = async (
  courseId: string,
  classId: string
) => {
  try {
    const nextPeriod = await getNextPeriod();
    if (!nextPeriod) return [];
    return await db.instructorSchedule.findMany({
      include: {
        day: true,
        shift: true,
        instructor: {
          include: {
            account: true,
          },
        },
      },
      where: {
        OR: [{ class: null }, { class: { id: classId } }],
        periodId: nextPeriod?.id,
        instructor: {
          instructorCourses: {
            some: {
              courseId,
            },
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(
      `Failed to fetch available instructors for the next period: ${error.message}`
    );
  }
};

export const getAvailableStudents = async (
  courseId: string,
  classId: string
) => {
  try {
    const nextPeriod = await getNextPeriod();
    if (!nextPeriod) return [];
    return await db.studentCourse.findMany({
      include: {
        student: {
          include: {
            account: true,
          },
        },
      },
      where: {
        OR: [{ class: null }, { class: { id: classId } }],
        courseId,
      },
    });
  } catch (error: any) {
    throw new Error(
      `Failed to fetch available students for the next period: ${error.message}`
    );
  }
};

export const updateClass = async (
  data: ClassTableInterface,
  pathname: string
): Promise<ServerActionsResponse<Class>> => {
  try {
    const newClass = await db.class.update({
      where: {
        id: data.id,
      },
      data: {
        instructorSchedule: {
          connect: {
            id: data.instructorScheduleId!,
          },
        },
        studentCourses: {
          set: data.studentCourses.map(({ id }) => ({ id })),
        },
        schedules: {
          update: data.schedules.map(
            ({ id, meetingUrl, recordingUrl, scheduleDate, scheduleTime }) => ({
              data: {
                meetingUrl,
                recordingUrl,
                scheduleDate,
                scheduleTime,
              },
              where: {
                id,
              },
            })
          ),
        },
      },
    });

    revalidatePath(pathname);
    return {
      data: newClass,
      error: null,
      message: 'Successfully updated class',
    };
  } catch (error: any) {
    console.log('updateClass', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to update class',
    };
  }
};

export const deleteClass = async (
  id: string,
  pathname: string
): Promise<ServerActionsResponse<Class>> => {
  try {
    const res = await db.class.delete({
      where: { id },
    });

    revalidatePath(pathname);
    return {
      data: res,
      error: null,
      message: 'Successfully deleted class',
    };
  } catch (error: any) {
    console.log('deleteClass', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to delete class',
    };
  }
};

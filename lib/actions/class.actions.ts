'use server';

import { MappedClass } from '@/app/(dashboard)/(routes)/admin/create-class/_stores/use-create-class-store';
import { db } from '../db';
import { getNextPeriod } from './period.actions';
import { revalidatePath } from 'next/cache';
import moment from 'moment';
import { ServerActionsResponse } from '@/types';
import { Class } from '@prisma/client';

export const createClass = async ({
  name,
  periodId,
  courseId,
}: {
  name: string;
  periodId: string;
  courseId: string;
}) => {
  try {
    return await db.class.create({
      data: {
        name,
        periodId,
        courseId,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to create class: ${error.message}`);
  }
};

export const getClassesForNextPeriod = async () => {
  try {
    const nextPeriod = await getNextPeriod();
    if (!nextPeriod) return [];
    return db.class.findMany({
      where: {
        periodId: nextPeriod.id,
      },
    });
  } catch (error: any) {
    throw new Error(
      `Failed to fetch classes for the next period: ${error.message}`
    );
  }
};

interface CreateClassesForNextPeriodParams {
  mappedClasses: MappedClass[];
}

export const createClassesForNextPeriod = async ({
  mappedClasses,
}: CreateClassesForNextPeriodParams): Promise<
  ServerActionsResponse<Class[]>
> => {
  try {
    const nextPeriod = await getNextPeriod();
    if (!nextPeriod) throw new Error('There is no next period');

    const instructorSchedules = await db.instructorSchedule.findMany({
      where: {
        periodId: nextPeriod.id,
      },
      include: {
        day: true,
        shift: true,
      },
    });

    const allSessions = await db.session.findMany();

    const transactions = mappedClasses.map(
      ({ courseId, instructorScheduleId, name, studentCourseIds }) => {
        const instructorSchedule = instructorSchedules.find(
          ({ id }) => id === instructorScheduleId
        );
        if (!instructorSchedule)
          throw new Error('Instructor schedule does not exist');

        const { day, shift } = instructorSchedule;

        const sessions = allSessions.filter(
          (session) => courseId === session.courseId
        );
        const startPeriod = moment(nextPeriod.startDate);

        let startDate = startPeriod;
        for (let i = 0; i < 7; i++) {
          const temp = startPeriod.clone().add(i, 'day');
          if (temp.day() === day.position) {
            startDate = temp;
            break;
          }
        }

        const schedules = sessions.map(({ sessionNumber }, idx) => ({
          scheduleDate: startDate
            .clone()
            .add(idx * 7, 'day')
            .toDate(),
          scheduleTime: `${shift.startTime} - ${shift.endTime}`,
          sessionNumber,
        }));

        return db.class.create({
          data: {
            name,
            courseId,
            periodId: nextPeriod.id,
            instructorScheduleId,
            studentCourses: {
              connect: studentCourseIds.map((id) => ({ id })),
            },
            schedules: {
              createMany: {
                data: schedules,
              },
            },
          },
        });
      }
    );

    const classes = await db.$transaction(transactions);
    revalidatePath('/admin/classes');
    return {
      data: classes,
      error: null,
      message: 'Successfully added classes',
    };
  } catch (error: any) {
    console.log('createClassesForNextPeriod', error.message);
    return {
      data: null,
      error: error.message,
      message: error.message,
    };
  }
};

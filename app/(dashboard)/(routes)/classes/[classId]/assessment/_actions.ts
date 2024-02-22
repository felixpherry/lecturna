'use server';

import { getServerDate } from '@/lib/actions/date.actions';
import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { Prisma, StudentScore } from '@prisma/client';
import moment from 'moment';
import { revalidatePath } from 'next/cache';

interface FetchStudentScoresParams {
  classId: string;
  evaluationId: string;
}

export const fetchStudentScores = async ({
  classId,
  evaluationId,
}: FetchStudentScoresParams) => {
  try {
    return await db.studentScore.findMany({
      where: { classId, evaluationId },
    });
  } catch (error: any) {
    console.log('fetchStudentScores', error.message);
    return [];
  }
};

export const canFillAssessment = async (
  classId: string,
  action: 'ADD' | 'EDIT'
) => {
  try {
    const lastSchedule = await db.schedule.findFirst({
      where: { classId },
      orderBy: {
        sessionNumber: 'desc',
      },
    });

    if (!lastSchedule) return false;

    const scheduleEndDate = moment.utc(
      `${moment(lastSchedule.scheduleDate).format('DD-MM-YYYY')} ${
        lastSchedule.scheduleTime.split(' - ')[1]
      }:00`,
      'DD-MM-YYYY HH:mm:ss'
    );

    const serverDate = moment(getServerDate());

    const hoursDiff = serverDate.diff(scheduleEndDate, 'hours');
    console.log(hoursDiff);
    return (
      (action === 'ADD' && hoursDiff <= 336) ||
      (action === 'EDIT' && hoursDiff <= 504)
    );
  } catch {
    return false;
  }
};

interface AddStudentScoresParams {
  evaluationId: string;
  classId: string;
  studentScores: {
    studentId: string;
    score: number;
  }[];
  pathname: string;
}

export const addStudentScores = async ({
  classId,
  evaluationId,
  pathname,
  studentScores,
}: AddStudentScoresParams): Promise<
  ServerActionsResponse<Prisma.BatchPayload>
> => {
  try {
    const canFill = await canFillAssessment(classId, 'ADD');

    if (!canFill) {
      throw new Error(
        "We're sorry, but the deadline for submitting assessment has passed. Submissions are no longer accepted."
      );
    }

    const res = await db.studentScore.createMany({
      data: studentScores.map(({ score, studentId }) => ({
        classId,
        evaluationId,
        score,
        studentId,
      })),
    });

    revalidatePath(pathname);

    return {
      data: res,
      error: null,
      message: 'Successfully updated assessment',
    };
  } catch (error: any) {
    console.log('addStudentScores', error.message);
    return {
      data: null,
      error: error.message,
      message: error.message,
    };
  }
};

interface UpdateStudentScoreParams {
  data: {
    studentScoreId: string;
    score: number;
  }[];
  pathname: string;
  classId: string;
}

export const updateStudentScores = async ({
  data,
  pathname,
  classId,
}: UpdateStudentScoreParams): Promise<
  ServerActionsResponse<StudentScore[]>
> => {
  try {
    const canFill = await canFillAssessment(classId, 'EDIT');

    if (!canFill) {
      throw new Error(
        "We're sorry, but the deadline for submitting assessment has passed. Submissions are no longer accepted."
      );
    }

    const res = await db.$transaction(
      data.map(({ score, studentScoreId }) =>
        db.studentScore.update({
          where: { id: studentScoreId },
          data: {
            score,
          },
        })
      )
    );
    revalidatePath(pathname);

    return {
      data: res,
      error: null,
      message: 'Successfully updated assessment',
    };
  } catch (error: any) {
    console.log('updateStudentScores', error.message);
    return {
      data: null,
      error: error.message,
      message: error.message,
    };
  }
};

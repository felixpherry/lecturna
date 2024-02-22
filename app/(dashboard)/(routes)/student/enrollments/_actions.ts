'use server';

import { getNextPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { revalidatePath } from 'next/cache';

interface EnrollCourseParams {
  courseId: string;
  pathname: string;
}

export const enrollCourse = async ({
  courseId,
  pathname,
}: EnrollCourseParams) => {
  try {
    const [nextPeriod, session] = await Promise.all([
      getNextPeriod(),
      getCurrentUser() as Promise<SessionInterface>,
    ]);
    if (!nextPeriod)
      throw new Error('There is no enrollment for the next period');

    if (!session) throw new Error('Unauthorized');
    if (session.user.role !== 'STUDENT')
      throw new Error('Only student can enroll for a course');

    const student = await db.student.findUnique({
      where: { accountId: session.user.id },
    });

    if (!student) throw new Error('Only student can enroll for a course');

    const enrollment = await db.studentCourse.create({
      data: {
        courseId,
        studentId: student.id,
        periodId: nextPeriod.id,
      },
    });

    revalidatePath(pathname);

    return enrollment;
  } catch (error: any) {
    console.log('enrollCourse', error.message);
    throw new Error(error.message);
  }
};

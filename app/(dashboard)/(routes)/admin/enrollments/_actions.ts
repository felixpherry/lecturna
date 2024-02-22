'use server';

import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { RegistrationStatus, StudentCourse } from '@prisma/client';
import { revalidatePath } from 'next/cache';

interface UpdateEnrollmentStatusParams {
  studentCourseId: string;
  status: RegistrationStatus;
  pathname: string;
}

export const updateEnrollmentStatus = async ({
  pathname,
  status,
  studentCourseId,
}: UpdateEnrollmentStatusParams): Promise<
  ServerActionsResponse<StudentCourse>
> => {
  try {
    const enrollment = await db.studentCourse.update({
      where: {
        id: studentCourseId,
      },
      data: {
        status,
      },
    });

    revalidatePath(pathname);
    return {
      data: enrollment,
      error: null,
      message: 'Successfully updated enrollment status',
    };
  } catch (error: any) {
    console.log('updateEnrollmentStatus', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to update enrollment status',
    };
  }
};

'use server';

import { revalidatePath, unstable_cache } from 'next/cache';
import { db } from '../db';
import { Attachment, Course, CourseEvaluation, Prisma } from '@prisma/client';
import { authorizeByRoles } from '../authorization';
import { utapi } from '@/app/api/uploadthing/core';
import { ServerActionsResponse } from '@/types';

export const getPublishedCourses = unstable_cache(
  async () => {
    try {
      return await db.course.findMany({
        where: {
          isPublished: true,
          isDeleted: false,
          program: {
            isPublished: true,
            isDeleted: false,
          },
        },
      });
    } catch (error: any) {
      console.log('getPublishedCourses', error);
      throw new Error('Internal Server Error');
    }
  },
  ['publishedCourses'],
  {
    revalidate: 24 * 60 * 60 * 1000,
  }
);

interface AddNewEvaluationParams {
  courseId: string;
  newEvaluation: Prisma.CourseEvaluationUncheckedCreateInput;
  pathname: string;
}

export const addNewEvaluation = async ({
  courseId,
  newEvaluation,
  pathname,
}: AddNewEvaluationParams): Promise<ServerActionsResponse<object>> => {
  try {
    await authorizeByRoles(['ADMIN']);

    const evaluations = await db.courseEvaluation.findMany({
      where: { courseId, isActive: true },
    });

    const totalCurrentScore = evaluations.reduce(
      (acc, evaluation) => acc + evaluation.weight,
      0
    );

    if (totalCurrentScore + newEvaluation.weight > 100) {
      throw new Error(
        'Total weight of all evaluations should not be greater than 100'
      );
    }

    const sessionReportEvaluation = evaluations.find(
      (evaluation) => evaluation.isSessionReport === true
    );
    if (
      newEvaluation.isSessionReport &&
      sessionReportEvaluation !== undefined
    ) {
      await db.$transaction([
        db.courseEvaluation.update({
          where: { id: sessionReportEvaluation.id },
          data: { isSessionReport: false },
        }),
        db.courseEvaluation.create({
          data: newEvaluation,
        }),
      ]);
    } else {
      await db.courseEvaluation.create({
        data: newEvaluation,
      });
    }

    revalidatePath(pathname);

    return {
      data: {},
      error: null,
      message: 'Successfully added evaluation',
    };
  } catch (error: any) {
    console.log('addNewEvaluation', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to add new evaluation',
    };
  }
};

interface DeleteCourseEvaluationParams {
  courseEvaluationId: string;
  pathname: string;
}

export const deleteCourseEvaluation = async ({
  courseEvaluationId,
  pathname,
}: DeleteCourseEvaluationParams): Promise<ServerActionsResponse<object>> => {
  try {
    await authorizeByRoles(['ADMIN']);

    const evaluation = await db.courseEvaluation.update({
      where: { id: courseEvaluationId },
      data: { isActive: false },
    });

    revalidatePath(pathname);

    return {
      data: evaluation,
      error: null,
      message: 'Successfully deleted evaluation',
    };
  } catch (error: any) {
    console.log('deleteCourseEvaluation', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to delete course evaluation',
    };
  }
};

interface UpdateCourseEvaluationParams {
  courseId: string;
  evaluationId: string;
  newEvaluation: Prisma.CourseEvaluationUncheckedCreateInput;
  pathname: string;
}

export const updateCourseEvaluation = async ({
  courseId,
  evaluationId,
  newEvaluation,
  pathname,
}: UpdateCourseEvaluationParams): Promise<ServerActionsResponse<object>> => {
  try {
    await authorizeByRoles(['ADMIN']);

    const evaluations = await db.courseEvaluation.findMany({
      where: { courseId, isActive: true },
    });

    const totalScore = evaluations.reduce(
      (acc, evaluation) =>
        acc +
        (evaluation.id === evaluationId
          ? newEvaluation.weight
          : evaluation.weight),
      0
    );

    if (totalScore > 100) {
      throw new Error(
        'Total weight of all evaluations should not be greater than 100'
      );
    }

    const sessionReportEvaluation = evaluations.find(
      (evaluation) =>
        evaluation.isSessionReport === true && evaluationId !== evaluation.id
    );

    if (
      newEvaluation.isSessionReport &&
      sessionReportEvaluation !== undefined
    ) {
      await db.$transaction([
        db.courseEvaluation.update({
          where: { id: sessionReportEvaluation.id },
          data: { isSessionReport: false },
        }),
        db.courseEvaluation.update({
          data: newEvaluation,
          where: {
            id: evaluationId,
          },
        }),
      ]);
    } else {
      await db.courseEvaluation.update({
        data: newEvaluation,
        where: {
          id: evaluationId,
        },
      });
    }

    revalidatePath(pathname);
    return {
      data: {},
      error: null,
      message: 'Successfully updated course evaluation',
    };
  } catch (error: any) {
    console.log('updateCourseEvaluation', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to update evaluation',
    };
  }
};

interface PublishCourseParams {
  courseId: string;
  pathname: string;
}

export const publishCourse = async ({
  courseId,
  pathname,
}: PublishCourseParams): Promise<ServerActionsResponse<Course>> => {
  try {
    await authorizeByRoles(['ADMIN']);
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        sessions: {
          where: {
            isPublished: true,
          },
        },
        evaluations: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!course) throw new Error('Course is not found');

    const hasSessionReportEvaluation = course.evaluations.find(
      ({ isSessionReport }) => isSessionReport === true
    );

    if (!hasSessionReportEvaluation)
      throw new Error("Course doesn't have evaluation for session report yet");

    const totalEvaluationWeight = course.evaluations.reduce(
      (curr, { weight }) => curr + weight,
      0
    );

    if (totalEvaluationWeight !== 100)
      throw new Error('Total weight of the course evaluation should be 100');

    if (course.sessions.length === 0)
      throw new Error('Course should have at least 1 session');

    const newCourse = await db.course.update({
      where: { id: course.id },
      data: {
        isPublished: true,
      },
    });

    revalidatePath(pathname);
    return {
      data: newCourse,
      error: null,
      message: 'Successfully published course',
    };
  } catch (error: any) {
    console.log('publishCourse', error.message);
    return {
      data: null,
      error: error.message,
      message: error.message,
    };
  }
};

export interface AddCourseAttachmentParams {
  sessionId: string;
  payload: Prisma.AttachmentUncheckedCreateInput;
  pathname: string;
}

export const addCourseAttachment = async ({
  sessionId,
  pathname,
  payload,
}: AddCourseAttachmentParams) => {
  try {
    await authorizeByRoles(['ADMIN']);

    const attachment = await db.attachment.create({
      data: {
        ...payload,
        sessionId,
      },
    });

    revalidatePath(pathname);
    return attachment;
  } catch (error: any) {
    console.log('addCourseAttachment', error.message);
    throw new Error(error.message);
  }
};

type EditCourseAttachmentParams = {
  prevData: Attachment;
  newData: {
    filename: string;
    fileKey?: string | null;
    fileType: string;
    fileUrl: string;
  };
  pathname: string;
};

export const editCourseAttachment = async ({
  prevData,
  newData,
  pathname,
}: EditCourseAttachmentParams) => {
  try {
    if (prevData.fileUrl !== newData.fileUrl && prevData.fileKey) {
      await utapi.deleteFiles(prevData.fileKey);
    }

    const attachment = await db.attachment.update({
      where: { id: prevData.id },
      data: newData,
    });

    revalidatePath(pathname);
    return attachment;
  } catch (error: any) {
    console.log('editCourseAttachment', error.message);
    throw new Error(error.message);
  }
};

interface UpdateCourseImageParams {
  courseId: string;
  image: string;
  fileKey?: string | null;
  pathname: string;
}

export const updateCourseImage = async ({
  image,
  pathname,
  courseId,
  fileKey,
}: UpdateCourseImageParams): Promise<ServerActionsResponse<Course>> => {
  try {
    await authorizeByRoles(['ADMIN']);

    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new Error('Course not found');
    }
    if (course.fileKey) await utapi.deleteFiles(course.fileKey);

    const newCourse = await db.course.update({
      data: {
        image,
        fileKey,
      },
      where: {
        id: courseId,
      },
    });

    revalidatePath(pathname);

    return {
      data: newCourse,
      error: null,
      message: 'Successfully updated image',
    };
  } catch (error: any) {
    console.log('updateCourseImage', error.message);
    return {
      data: null,
      error: error.message,
      message: error.message,
    };
  }
};

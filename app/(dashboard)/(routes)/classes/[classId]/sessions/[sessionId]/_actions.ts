'use server';

import { utapi } from '@/app/api/uploadthing/core';
import { db } from '@/lib/db';
import { OtherAttachment, Prisma, SessionReport } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { SessionReportItem } from './_components/AddSessionReportForm';
import { ServerActionsResponse } from '@/types';
import moment from 'moment';
import { getServerDate } from '@/lib/actions/date.actions';

export type AddNewAttachmentPayload = {
  name: string;
  fileKey?: string | null;
  type: string;
  fileUrl: string;
};

type AddNewAttachmentParams = {
  scheduleId: string;
  payload: AddNewAttachmentPayload;
  pathname: string;
};

export const addNewAttachment = async ({
  scheduleId,
  payload,
  pathname,
}: AddNewAttachmentParams) => {
  try {
    const attachment = await db.otherAttachment.create({
      data: {
        ...payload,
        schedule: {
          connect: { id: scheduleId },
        },
      },
    });

    revalidatePath(pathname);
    return attachment;
  } catch (error: any) {
    throw new Error(`Failed to add new resource: ${error.message}`);
  }
};

type DeleteAttachmentParams = {
  id: string;
  fileKey: string | null;
  pathname: string;
};

export const deleteAttachment = async ({
  id,
  pathname,
  fileKey,
}: DeleteAttachmentParams) => {
  try {
    if (fileKey) {
      await utapi.deleteFiles(fileKey);
    }

    const attachment = await db.otherAttachment.delete({
      where: { id },
    });
    revalidatePath(pathname);
    return attachment;
  } catch (error: any) {
    throw new Error(`Failed to delete attachment: ${error.message}`);
  }
};

type EditAttachmentParams = {
  prevData: OtherAttachment;
  newData: {
    name: string;
    fileKey?: string | null;
    type: string;
    fileUrl: string;
  };
  pathname: string;
};

export const editAttachment = async ({
  prevData,
  newData,
  pathname,
}: EditAttachmentParams) => {
  try {
    if (prevData.fileUrl !== newData.fileUrl && prevData.fileKey) {
      await utapi.deleteFiles(prevData.fileKey);
    }

    const attachment = await db.otherAttachment.update({
      where: { id: prevData.id },
      data: newData,
    });

    revalidatePath(pathname);
    return attachment;
  } catch (error: any) {
    throw new Error(`Failed to update attachment: ${error.message}`);
  }
};

export const fetchStudents = async (classId: string) => {
  try {
    const students = await db.student.findMany({
      where: {
        studentCourses: {
          some: {
            classId,
          },
        },
      },
      include: {
        account: true,
      },
      orderBy: {
        account: {
          name: 'asc',
        },
      },
    });

    return students;
  } catch (error: any) {
    throw new Error(`Failed to fetch students: ${error.message}`);
  }
};

export const canFillSessionReports = async (
  scheduleId: string,
  action: 'ADD' | 'EDIT'
) => {
  try {
    const schedule = await db.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) return false;

    const scheduleEndDate = moment.utc(
      `${moment(schedule.scheduleDate).format('DD-MM-YYYY')} ${
        schedule.scheduleTime.split(' - ')[1]
      }:00`,
      'DD-MM-YYYY HH:mm:ss'
    );

    const serverDate = moment(getServerDate());

    const hoursDiff = serverDate.diff(scheduleEndDate, 'hours');

    return (
      (action === 'ADD' && hoursDiff >= 0 && hoursDiff <= 24) ||
      (action === 'EDIT' && hoursDiff >= 0 && hoursDiff <= 192)
    );
  } catch {
    return false;
  }
};

interface AddSessionReportsParams {
  sessionReports: SessionReportItem[];
  pathname: string;
}

export const addSessionReports = async ({
  sessionReports,
  pathname,
}: AddSessionReportsParams): Promise<
  ServerActionsResponse<Prisma.BatchPayload>
> => {
  if (!sessionReports.length) throw new Error('Data should not be empty');

  try {
    const canFill = await canFillSessionReports(
      sessionReports[0].scheduleId,
      'ADD'
    );

    if (!canFill) {
      throw new Error(
        "We're sorry, but the deadline for submitting session reports has passed. Submissions are no longer accepted."
      );
    }

    const res = await db.sessionReport.createMany({
      data: sessionReports.map(
        ({ attendanceStatus, feedback, scheduleId, score, studentId }) => ({
          attendanceStatus,
          feedback,
          scheduleId,
          score,
          studentId,
        })
      ),
    });

    revalidatePath(pathname);
    return {
      data: res,
      error: null,
      message: 'Successfully added session reports',
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message,
      message: error.message,
    };
  }
};

interface UpdateSessionReportsParams {
  sessionReports: SessionReportItem[];
  pathname: string;
}

export const updateSessionReports = async ({
  pathname,
  sessionReports,
}: UpdateSessionReportsParams): Promise<
  ServerActionsResponse<SessionReport[]>
> => {
  try {
    if (sessionReports.some(({ id }) => id === null) || !sessionReports.length)
      throw new Error('Session report ID is missing');

    const canFill = await canFillSessionReports(
      sessionReports[0].scheduleId,
      'EDIT'
    );

    if (!canFill) {
      throw new Error(
        "We're sorry, but the deadline for submitting session reports has passed. Submissions are no longer accepted."
      );
    }

    const updatedSessionReports = await db.$transaction(
      sessionReports.map((report) =>
        db.sessionReport.update({
          where: {
            id: report.id!,
          },
          data: {
            attendanceStatus: report.attendanceStatus,
            feedback: report.feedback,
            score: report.score,
          },
        })
      )
    );

    revalidatePath(pathname);

    return {
      data: updatedSessionReports,
      error: null,
      message: 'Successfully updated session reports',
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message,
      message: error.message,
    };
  }
};

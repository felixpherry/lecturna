'use server';

import { db } from '@/lib/db';

export const fetchStudentReports = async (
  classId: string,
  studentId: string
) => {
  try {
    const reports = await db.sessionReport.findMany({
      where: {
        studentId,
        schedule: {
          classId,
        },
      },
      include: {
        schedule: true,
      },
      orderBy: {
        schedule: {
          sessionNumber: 'asc',
        },
      },
    });

    return reports;
  } catch (error: any) {
    throw new Error(`Failed to fetch student reports: ${error.message}`);
  }
};

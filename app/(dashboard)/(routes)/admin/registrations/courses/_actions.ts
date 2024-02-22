'use server';

import { db } from '@/lib/db';
import {
  Account,
  CourseRegistration,
  Prisma,
  RegistrationStatus,
} from '@prisma/client';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { getNextPeriod } from '@/lib/actions/period.actions';
import { ServerActionsResponse } from '@/types';

export const updateCourseRegistrationStatus = async ({
  id,
  status,
  pathname,
}: {
  id: string;
  status: RegistrationStatus;
  pathname: string;
}): Promise<ServerActionsResponse<CourseRegistration>> => {
  try {
    const data = await db.courseRegistration.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    revalidatePath(pathname);
    return {
      data,
      error: null,
      message: 'Successfully updated registration status',
    };
  } catch (error: any) {
    console.log('updateCourseRegistrationStatus', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

export const fetchCourseRegistrationDetail = async (id: string) => {
  try {
    return await db.courseRegistration.findUnique({
      where: { id },
    });
  } catch (error: any) {
    throw new Error(
      `Failed to fetch course registration detail: ${error.message}`
    );
  }
};

export const createAccountForStudent = async (
  payload: CourseRegistration
): Promise<ServerActionsResponse<Account>> => {
  try {
    const {
      childEmail,
      address,
      birthPlace,
      childGender,
      childName,
      courseId,
      dateOfBirth,
      educationInstitution,
      parentEmail,
      gradeClass,
      parentName,
      phoneNumber,
    } = payload;

    const hashedPassword = await bcrypt.hash(
      moment(dateOfBirth).format('DDMMYYYY'),
      10
    );
    const date = new Date();
    const studentId = `${date.getFullYear() % 100}${
      date.getMonth() < 9 ? '0' + `${date.getMonth() + 1}` : date.getMonth() + 1
    }${Date.now() % 1000000}`;

    const period = await getNextPeriod();

    if (!period) throw new Error("There's no period.");

    const account = await db.account.create({
      data: {
        email: childEmail,
        name: childName,
        role: 'STUDENT',
        address,
        password: hashedPassword,
        student: {
          create: {
            birthPlace,
            dateOfBirth,
            educationInstitution,
            gender: childGender,
            gradeClass,
            studentId,
            parent: {
              create: {
                account: {
                  create: {
                    email: parentEmail,
                    name: parentName,
                    role: 'PARENT',
                    address,
                    password: hashedPassword,
                    phoneNumber,
                  },
                },
              },
            },
            studentCourses: {
              create: {
                status: 'APPROVED',
                courseId,
                periodId: period.id,
              },
            },
          },
        },
      },
    });
    return {
      data: account,
      error: null,
      message:
        'Successfully created account for the user. Please contact the user for the account credentials.',
    };
  } catch (error: any) {
    console.log('createAccountForStudent', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Failed to create account. Email is already registered.',
        };
      }
    }
    return {
      data: null,
      error: error.message,
      message: 'Failed to create account.',
    };
  }
};

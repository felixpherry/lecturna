'use server';

import { db } from '@/lib/db';
import {
  Account,
  InstructorRegistration,
  Prisma,
  RegistrationStatus,
} from '@prisma/client';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { ServerActionsResponse } from '@/types';

export const updateInstructorRegistrationStatus = async ({
  id,
  status,
  pathname,
}: {
  id: string;
  status: RegistrationStatus;
  pathname: string;
}): Promise<ServerActionsResponse<InstructorRegistration>> => {
  try {
    const data = await db.instructorRegistration.update({
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
    console.log('updateInstructorRegistrationStatus', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

export const fetchInstructorRegistrationDetail = async (id: string) => {
  try {
    return await db.instructorRegistration.findUnique({
      where: { id },
    });
  } catch (error: any) {
    throw new Error(
      `Failed to fetch instructor registration detail: ${error.message}`
    );
  }
};

export const createAccountForInstructor = async (
  payload: {
    skills: {
      id: string;
      name: string;
    }[];
  } & InstructorRegistration
): Promise<ServerActionsResponse<Account>> => {
  try {
    const {
      address,
      dateOfBirth,
      educationInstitution,
      email,
      lastEducation,
      name,
      phoneNumber,
      skills,
    } = payload;

    const hashedPassword = await bcrypt.hash(
      moment(dateOfBirth).format('DDMMYYYY'),
      10
    );

    const account = await db.account.create({
      data: {
        email,
        name,
        role: 'INSTRUCTOR',
        address,
        instructor: {
          create: {
            dateOfBirth,
            educationInstitution,
            lastEducation,
            skills: {
              connect: skills.map(({ id }) => ({ id })),
            },
          },
        },
        password: hashedPassword,
        phoneNumber,
      },
    });
    return {
      data: account,
      error: null,
      message:
        'Successfully created account for the user. Please contact the user for the account credentials.',
    };
  } catch (error: any) {
    console.log('createAccountForInstructor', error.message);
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

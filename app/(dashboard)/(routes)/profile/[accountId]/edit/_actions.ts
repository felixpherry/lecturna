'use server';

import { db } from '@/lib/db';
import { Account, Gender, Instructor, Prisma, Student } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { utapi } from '@/app/api/uploadthing/core';
import { ServerActionsResponse } from '@/types';

interface UpdateAccountParams {
  id: string;
  image: string;
  fileKey: string | null;
  username: string;
  phoneNumber: string;
  address: string;
  pathname: string;
}

export const updateAccount = async ({
  id,
  image,
  fileKey,
  address,
  pathname,
  phoneNumber,
  username,
}: UpdateAccountParams): Promise<ServerActionsResponse<Account>> => {
  try {
    const account = await db.account.findUnique({
      where: { id },
    });

    if (!account) throw new Error('Account not found');

    if (account.fileKey !== fileKey && account.fileKey) {
      await utapi.deleteFiles(account.fileKey);
    }

    const newAccount = await db.account.update({
      where: { id },
      data: {
        address,
        phoneNumber,
        username,
        image,
        fileKey,
      },
    });

    revalidatePath(pathname);

    return {
      data: newAccount,
      error: null,
      message: 'Successfully updated account.',
    };
  } catch (error: any) {
    console.log('updateAccount', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Username must be unique.',
        };
      }
    }
    return {
      data: null,
      error: error.message,
      message: error.message,
    };
  }
};

interface ChangePasswordParams {
  id: string;
  currentPassword: string;
  newPassword: string;
  pathname: string;
}

export const changePassword = async ({
  id,
  currentPassword,
  newPassword,
  pathname,
}: ChangePasswordParams): Promise<ServerActionsResponse<Account>> => {
  try {
    const account = await db.account.findUnique({
      where: { id },
    });

    if (!account) throw new Error('Account not found.');

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      account.password!
    );

    if (!passwordMatch) throw new Error("Current password didn't match.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const newAccount = await db.account.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    revalidatePath(pathname);

    return {
      data: newAccount,
      error: null,
      message: 'Successfully changed password.',
    };
  } catch (error: any) {
    console.log('changePassword', error.message);
    return {
      data: null,
      error: error.message,
      message: error.message,
    };
  }
};

interface UpdateStudentInfoParams {
  id: string;
  birthPlace: string;
  dateOfBirth: Date;
  gender: Gender;
  gradeClass: string;
  educationInstitution: string;
  hobby: string;
  ambition: string;
  pathname: string;
}

export const updateStudentInfo = async ({
  id,
  ambition,
  birthPlace,
  dateOfBirth,
  educationInstitution,
  gender,
  gradeClass,
  hobby,
  pathname,
}: UpdateStudentInfoParams): Promise<ServerActionsResponse<Student>> => {
  try {
    const student = await db.student.update({
      where: { id },
      data: {
        ambition,
        birthPlace,
        dateOfBirth,
        educationInstitution,
        gender,
        hobby,
        gradeClass,
      },
    });

    revalidatePath(pathname);

    return {
      data: student,
      error: null,
      message: 'Successfully updated student information.',
    };
  } catch (error: any) {
    console.log('updateStudentInfo', error.message);
    return {
      data: null,
      error: error.message,
      message: error.message,
    };
  }
};

export const fetchSkills = async () => {
  try {
    return await db.skill.findMany({
      where: { isActive: true },
    });
  } catch (error: any) {
    console.log('fetchSkills', error.message);
    throw new Error(error.message);
  }
};

interface UpdateInstructorInfoParams {
  id: string;
  dateOfBirth: Date;
  lastEducation: string;
  educationInstitution: string;
  skillIds: string[];
  pathname: string;
}

export const updateInstructorInfo = async ({
  dateOfBirth,
  educationInstitution,
  id,
  lastEducation,
  skillIds,
  pathname,
}: UpdateInstructorInfoParams): Promise<ServerActionsResponse<Instructor>> => {
  try {
    const instructor = await db.instructor.update({
      where: { id },
      data: {
        dateOfBirth,
        educationInstitution,
        lastEducation,
        skills: {
          set: skillIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath(pathname);

    return {
      data: instructor,
      error: null,
      message: 'Successfully updated instructor information.',
    };
  } catch (error: any) {
    console.log('updateInstructorInfo', error.message);
    return {
      data: null,
      error: error.message,
      message: error.message,
    };
  }
};

'use server';

import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { MasterGrade, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

interface AddNewGradeCategoryParams {
  payload: Prisma.MasterGradeCreateInput;
  pathname: string;
}

export const addNewGradeCategory = async ({
  pathname,
  payload,
}: AddNewGradeCategoryParams): Promise<ServerActionsResponse<MasterGrade>> => {
  try {
    const gradeCategory = await db.masterGrade.create({
      data: {
        category: payload.category,
        description: payload.description,
        minScore: payload.minScore,
        maxScore: payload.maxScore,
        hexCode: payload.hexCode,
      },
    });
    revalidatePath(pathname);

    return {
      data: gradeCategory,
      error: null,
      message: 'Successfully added new grade category',
    };
  } catch (error: any) {
    console.log('addNewGradeCategory', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Category name, min score, and max score must be unique',
        };
      }
    }
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

interface UpdateGradeCategoryParams {
  id: string;
  payload: Prisma.MasterGradeUpdateInput;
  pathname: string;
}

export const updateGradeCategory = async ({
  id,
  pathname,
  payload,
}: UpdateGradeCategoryParams): Promise<ServerActionsResponse<MasterGrade>> => {
  try {
    const gradeCategory = await db.masterGrade.update({
      data: payload,
      where: { id },
    });
    revalidatePath(pathname);

    return {
      data: gradeCategory,
      error: null,
      message: 'Successfully updated grade category',
    };
  } catch (error: any) {
    console.log('updateGradeCategory', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Category name, min score, and max score must be unique',
        };
      }
    }
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

interface DeleteGradeCategoryParams {
  id: string;
  pathname: string;
}

export const deleteGradeCategory = async ({
  id,
  pathname,
}: DeleteGradeCategoryParams): Promise<ServerActionsResponse<MasterGrade>> => {
  try {
    const gradeCategory = await db.masterGrade.delete({
      where: { id },
    });
    revalidatePath(pathname);

    return {
      data: gradeCategory,
      error: null,
      message: 'Successfully deleted new grade category',
    };
  } catch (error: any) {
    console.log('deleteGradeCategory', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

interface ChangeGradeCategoryStatusParams {
  id: string;
  isActive: boolean;
  pathname: string;
}

export const changeGradeCategoryStatus = async ({
  id,
  isActive,
  pathname,
}: ChangeGradeCategoryStatusParams): Promise<
  ServerActionsResponse<MasterGrade>
> => {
  try {
    const grade = await db.masterGrade.update({
      where: { id },
      data: {
        isActive,
        statusChangedDate: new Date(),
      },
    });

    revalidatePath(pathname);

    return {
      data: grade,
      error: null,
      message: 'Successfully changed grade category status',
    };
  } catch (error: any) {
    console.log('changeGradeCategoryStatus', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

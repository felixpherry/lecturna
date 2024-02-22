'use server';

import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { Prisma, Skill } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const addNewSkill = async ({
  payload,
  pathname,
}: {
  payload: Prisma.SkillUncheckedCreateInput;
  pathname: string;
}): Promise<ServerActionsResponse<Skill>> => {
  try {
    const skill = await db.skill.create({
      data: payload,
    });

    revalidatePath(pathname);
    return {
      data: skill,
      error: null,
      message: 'Successfully added new skill',
    };
  } catch (error: any) {
    console.log('addNewSkill', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Skill name must be unique',
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

export const updateSkill = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Prisma.SkillUncheckedCreateInput;
  pathname: string;
}): Promise<ServerActionsResponse<Skill>> => {
  try {
    const skill = await db.skill.update({
      where: { id },
      data: payload,
    });

    revalidatePath(pathname);

    return {
      data: skill,
      error: null,
      message: 'Successfully updated skill',
    };
  } catch (error: any) {
    console.log('updateSkill', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Skill name must be unique',
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

export const deleteSkill = async ({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}): Promise<ServerActionsResponse<Skill>> => {
  try {
    const skill = await db.skill.delete({
      where: { id },
    });

    revalidatePath(pathname);

    return {
      data: skill,
      error: null,
      message: 'Successfully deleted skill',
    };
  } catch (error: any) {
    console.log('deleteSkill', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

export const changeSkillStatus = async ({
  id,
  isActive,
  pathname,
}: {
  id: string;
  isActive: boolean;
  pathname: string;
}): Promise<ServerActionsResponse<Skill>> => {
  try {
    const skill = await db.skill.update({
      where: { id },
      data: { isActive, statusChangedDate: new Date() },
    });

    revalidatePath(pathname);

    return {
      data: skill,
      error: null,
      message: 'Successfully changed skill status',
    };
  } catch (error: any) {
    console.log('changeSkillStatus', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

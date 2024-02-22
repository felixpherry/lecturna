'use server';

import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { MasterShift, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const addNewShift = async ({
  payload,
  pathname,
}: {
  payload: Prisma.MasterShiftUncheckedCreateInput;
  pathname: string;
}): Promise<ServerActionsResponse<MasterShift>> => {
  try {
    const shift = await db.masterShift.create({
      data: payload,
    });

    revalidatePath(pathname);
    return {
      data: shift,
      error: null,
      message: 'Successfully added new shift',
    };
  } catch (error: any) {
    console.log('addNewShift', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

export const updateShift = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Prisma.MasterShiftUncheckedUpdateInput;
  pathname: string;
}) => {
  try {
    const shift = await db.masterShift.update({
      where: { id },
      data: payload,
    });

    revalidatePath(pathname);

    return {
      data: shift,
      error: null,
      message: 'Successfully updated shift',
    };
  } catch (error: any) {
    console.log('updateShift', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

export const deleteShift = async ({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}) => {
  try {
    const shift = await db.masterShift.delete({
      where: { id },
    });

    revalidatePath(pathname);

    return {
      data: shift,
      error: null,
      message: 'Successfully deleted new shift',
    };
  } catch (error: any) {
    console.log('deleteShift', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

export const changeShiftStatus = async ({
  id,
  isActive,
  pathname,
}: {
  id: string;
  isActive: boolean;
  pathname: string;
}) => {
  try {
    const shift = await db.masterShift.update({
      where: { id },
      data: { isActive, statusChangedDate: new Date() },
    });

    revalidatePath(pathname);

    return {
      data: shift,
      error: null,
      message: 'Successfully changed shift status',
    };
  } catch (error: any) {
    console.log('changeShiftStatus', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

'use server';

import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { Period, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const addNewPeriod = async ({
  payload,
  pathname,
}: {
  payload: Prisma.PeriodUncheckedCreateInput;
  pathname: string;
}): Promise<ServerActionsResponse<Period>> => {
  try {
    const period = await db.period.create({
      data: payload,
    });

    revalidatePath(pathname);

    return {
      data: period,
      error: null,
      message: 'Successfully added period',
    };
  } catch (error: any) {
    console.log('addNewPeriod', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Period name must be unique',
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

export const updatePeriod = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Prisma.PeriodUncheckedUpdateInput;
  pathname: string;
}): Promise<ServerActionsResponse<Period>> => {
  try {
    const period = await db.period.update({
      where: { id },
      data: payload,
    });

    revalidatePath(pathname);

    return {
      data: period,
      error: null,
      message: 'Successfully updated period',
    };
  } catch (error: any) {
    console.log('updatePeriod', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Period name must be unique',
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

export const deletePeriod = async ({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}): Promise<ServerActionsResponse<Period>> => {
  try {
    const period = await db.period.delete({
      where: { id },
    });

    revalidatePath(pathname);

    return {
      data: period,
      error: null,
      message: 'Successfully deleted period',
    };
  } catch (error: any) {
    console.log('deletePeriod', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

export const changePeriodStatus = async ({
  id,
  isActive,
  pathname,
}: {
  id: string;
  isActive: boolean;
  pathname: string;
}): Promise<ServerActionsResponse<Period>> => {
  try {
    const period = await db.period.update({
      where: { id },
      data: {
        isActive,
        statusChangedDate: new Date(),
      },
    });

    revalidatePath(pathname);

    return {
      data: period,
      error: null,
      message: 'Successfully changed period status',
    };
  } catch (error: any) {
    console.log('changePeriodStatus', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

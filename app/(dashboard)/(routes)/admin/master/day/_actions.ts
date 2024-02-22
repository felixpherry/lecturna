'use server';

import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { MasterDay } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const changeDayStatus = async ({
  id,
  isActive,
  pathname,
}: {
  id: string;
  isActive: boolean;
  pathname: string;
}): Promise<ServerActionsResponse<MasterDay>> => {
  try {
    const day = await db.masterDay.update({
      where: {
        id,
      },
      data: {
        isActive,
        statusChangedDate: new Date(),
      },
    });

    revalidatePath(pathname);

    return {
      data: day,
      error: null,
      message: 'Successfully changed day status',
    };
  } catch (error: any) {
    console.log('changeDayStatus', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

'use server';

import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { RegistrationStatus, TrialClassRegistration } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const updateTrialClassRegistrationStatus = async ({
  id,
  status,
  pathname,
}: {
  id: string;
  status: RegistrationStatus;
  pathname: string;
}): Promise<ServerActionsResponse<TrialClassRegistration>> => {
  try {
    const data = await db.trialClassRegistration.update({
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
    console.log('updateTrialClassRegistrationStatus');
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

export const fetchTrialClassDetail = async (id: string) => {
  try {
    return await db.trialClassRegistration.findUnique({
      where: { id },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch trial class detail: ${error.message}`);
  }
};

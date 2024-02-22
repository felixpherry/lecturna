'use server';

import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { Account, Status } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const updateAccountStatus = async ({
  id,
  status,
  pathname,
}: {
  id: string;
  status: Status;
  pathname: string;
}): Promise<ServerActionsResponse<Account>> => {
  try {
    const account = await db.account.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    revalidatePath(pathname);
    return {
      data: account,
      error: null,
      message: 'Successfully updated account status',
    };
  } catch (error: any) {
    console.log('updateAccountStatus', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to update account status',
    };
  }
};

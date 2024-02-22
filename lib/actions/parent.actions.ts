'use server';

import { db } from '../db';

export const getChildAccountId = async (accountId: string) => {
  try {
    return (await getChildAccount(accountId))?.id;
  } catch (error: any) {
    console.log('getChildAccountId', error.message);
    throw new Error(error.message);
  }
};

export const getChildAccount = async (accountId: string) => {
  try {
    const childAccount = await db.account.findFirst({
      where: {
        student: {
          parent: { accountId },
        },
      },
    });

    return childAccount;
  } catch (error: any) {
    console.log('getChildAccountId', error.message);
    throw new Error(error.message);
  }
};

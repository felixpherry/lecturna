'use server';

import { db } from '../db';
import { Prisma } from '@prisma/client';

export const insertTrialClassData = async (
  data: Prisma.TrialClassRegistrationCreateInput
) => {
  try {
    await db.trialClassRegistration.create({
      data,
    });
  } catch (error: any) {
    throw new Error(`Failed to insert trial class data: ${error.message}`);
  }
};

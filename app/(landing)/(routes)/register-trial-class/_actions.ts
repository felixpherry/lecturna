'use server';

import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { Prisma, TrialClassRegistration } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const registerTrialClass = async ({
  payload,
  pathname,
}: {
  payload: Prisma.TrialClassRegistrationUncheckedCreateInput;
  pathname: string;
}): Promise<ServerActionsResponse<TrialClassRegistration>> => {
  try {
    const data = await db.trialClassRegistration.create({
      data: {
        ...payload,
      },
    });

    revalidatePath(pathname);
    return {
      data,
      error: null,
      message:
        'Pendaftaran berhasil. Silakan tunggu info lebih lanjut dari admin.',
    };
  } catch (error: any) {
    console.log('registerTrialClass', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message:
            'Email atau No.HP Anda telah terdaftar di sistem. Silakan gunakan email atau No. HP yang lain.',
        };
      }
    }
    return {
      data: null,
      error: error.message,
      message: 'Pendaftaran gagal. Harap coba lagi nanti',
    };
  }
};

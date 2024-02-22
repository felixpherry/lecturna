'use server';

import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { InstructorRegistration, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const registerInstructor = async ({
  payload,
  pathname,
}: {
  payload: {
    data: Prisma.InstructorRegistrationCreateInput;
    skills: string[];
  };
  pathname: string;
}): Promise<ServerActionsResponse<InstructorRegistration>> => {
  try {
    const result = await db.instructorRegistration.create({
      data: {
        ...payload.data,
        skills: {
          connect: payload.skills.map((id) => ({ id })),
        },
      },
    });

    revalidatePath(pathname);
    return {
      data: result,
      error: null,
      message:
        'Pendaftaran berhasil. Silakan tunggu info lebih lanjut dari admin.',
    };
  } catch (error: any) {
    console.log('registerInstructor', error.message);
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

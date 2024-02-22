'use server';

import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { CourseRegistration, Prisma } from '@prisma/client';

export const fetchCouponByCode = async (code: string) => {
  try {
    return await db.coupon.findUnique({
      where: {
        code,
        expiredAt: {
          gt: new Date(),
        },
        isActive: true,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    throw new Error(`Error fetching coupon: ${error.message}`);
  }
};

export const registerCourse = async ({
  payload,
}: {
  payload: Prisma.CourseRegistrationUncheckedCreateInput;
}): Promise<ServerActionsResponse<CourseRegistration>> => {
  try {
    const data = await db.courseRegistration.create({
      data: payload,
    });

    return {
      data,
      error: null,
      message:
        'Pendaftaran berhasil. Silakan tunggu info lebih lanjut dari admin.',
    };
  } catch (error: any) {
    console.log('registerCourse', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message:
            'Email atau No.HP yang digunakan telah terdaftar di sistem. Silakan gunakan email atau No. HP yang lain.',
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

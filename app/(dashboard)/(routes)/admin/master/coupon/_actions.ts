'use server';

import { db } from '@/lib/db';
import { ServerActionsResponse } from '@/types';
import { Coupon, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const addNewCoupon = async ({
  payload,
  pathname,
}: {
  payload: Prisma.CouponUncheckedCreateInput;
  pathname: string;
}): Promise<ServerActionsResponse<Coupon>> => {
  try {
    const coupon = await db.coupon.create({
      data: payload,
    });

    revalidatePath(pathname);
    return {
      data: coupon,
      error: null,
      message: 'Successfully added new coupon',
    };
  } catch (error: any) {
    console.log('addNewCoupon', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Coupon code must be unique',
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

export const updateCoupon = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Prisma.CouponUncheckedCreateInput;
  pathname: string;
}): Promise<ServerActionsResponse<Coupon>> => {
  try {
    const coupon = await db.coupon.update({
      where: { id },
      data: payload,
    });

    revalidatePath(pathname);

    return {
      data: coupon,
      error: null,
      message: 'Successfully updated coupon',
    };
  } catch (error: any) {
    console.log('updateCoupon', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Coupon code must be unique',
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

export const deleteCoupon = async ({
  id,
  pathname,
}: {
  id: string;
  pathname: string;
}): Promise<ServerActionsResponse<Coupon>> => {
  try {
    const coupon = await db.coupon.delete({
      where: { id },
    });

    revalidatePath(pathname);

    return {
      data: coupon,
      error: null,
      message: 'Successfully deleted coupon',
    };
  } catch (error: any) {
    console.log('deleteCoupon', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

export const updateCouponStatus = async ({
  id,
  isActive,
  pathname,
}: {
  id: string;
  isActive: boolean;
  pathname: string;
}): Promise<ServerActionsResponse<Coupon>> => {
  try {
    const coupon = await db.coupon.update({
      where: { id },
      data: { isActive, statusChangedDate: new Date() },
    });

    revalidatePath(pathname);

    return {
      data: coupon,
      error: null,
      message: 'Successfully changed coupon status',
    };
  } catch (error: any) {
    console.log('updateCouponStatus', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Internal Server Error',
    };
  }
};

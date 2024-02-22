'use server';

import { revalidatePath, unstable_cache } from 'next/cache';
import { db } from '../db';
import { Logo } from '@prisma/client';
import { utapi } from '@/app/api/uploadthing/core';
import { ServerActionsResponse } from '@/types';

export const fetchLogo = unstable_cache(
  async () => {
    try {
      return await db.logo.findFirst();
    } catch (error: any) {
      console.log('fetchLogo', error);
      throw new Error('Internal Server Error');
    }
  },
  ['logo'],
  {
    revalidate: 24 * 60 * 60 * 1000,
  }
);

interface CreateOrUpdateLogoParams {
  payload: {
    image: string;
    fileKey: string | null;
  };
  pathname: string;
}

export const createOrUpdateLogo = async ({
  pathname,
  payload,
}: CreateOrUpdateLogoParams): Promise<ServerActionsResponse<Logo>> => {
  try {
    const { fileKey, image } = payload;

    const existingLogo = await db.logo.findFirst();
    let logo: Logo | null = null;
    if (!existingLogo) {
      logo = await db.logo.create({
        data: {
          image,
          fileKey,
        },
      });
    } else {
      if (payload.fileKey !== existingLogo.fileKey && existingLogo.fileKey) {
        await utapi.deleteFiles(existingLogo.fileKey);
      }
      logo = await db.logo.update({
        where: { id: existingLogo.id },
        data: {
          fileKey,
          image,
        },
      });
    }

    revalidatePath(pathname);

    return {
      data: logo,
      error: null,
      message: 'Successfully updated logo',
    };
  } catch (error: any) {
    console.log('createOrUpdateLogo', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to update logo',
    };
  }
};

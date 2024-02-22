'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../db';
import bcrypt from 'bcrypt';
import { getCurrentUser } from '../session';

export const getSession = async () => {
  return await getCurrentUser();
};

export const fetchAccountDetail = async (id: string) => {
  try {
    return await db.account.findUnique({
      where: {
        id,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch account detail: $${error.message}`);
  }
};

export const updateProfile = async ({
  id,
  name,
  username,
  email,
  password,
  phoneNumber,
  address,
  image,
  onboarded,
  pathname,
}: {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  image?: string;
  onboarded: boolean;
  pathname: string;
}) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.account.update({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        image: image || '',
        onboarded,
      },
      where: {
        id,
      },
    });

    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
};

'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';

export interface ParentAccountDetail {
  image: string;
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
}

interface HandleParentOnboardingParams {
  accountDetail: ParentAccountDetail;
  pathname: string;
}

export const handleParentOnboarding = async ({
  accountDetail,
  pathname,
}: HandleParentOnboardingParams) => {
  try {
    const session = (await getCurrentUser()) as SessionInterface;
    if (!session?.user) throw new Error('Unauthorized');

    const { address, email, image, name, password, phoneNumber, username } =
      accountDetail;

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await db.account.update({
      where: {
        id: session.user.id,
      },
      data: {
        image,
        name,
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        onboarded: true,
      },
    });

    revalidatePath(pathname);

    return account;
  } catch (error: any) {
    throw new Error(`Failed to onboard: ${error.message}`);
  }
};

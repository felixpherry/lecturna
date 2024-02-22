'use server';

import { getCurrentUser } from '@/lib/session';
import {
  StudentAccountDetail,
  StudentPersonalInfo,
} from './_stores/use-student-onboarding-store';
import { SessionInterface } from '@/types';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

interface HandleStudentOnboardingParams {
  accountDetail: StudentAccountDetail;
  personalInfo: StudentPersonalInfo;
}

export const handleStudentOnboarding = async ({
  accountDetail,
  personalInfo,
}: HandleStudentOnboardingParams) => {
  try {
    const session = (await getCurrentUser()) as SessionInterface;
    if (!session) throw new Error('Unauthorized');

    const { image, password, username } = accountDetail;
    const {
      address,
      ambition,
      birthPlace,
      dateOfBirth,
      educationInstitution,
      gender,
      gradeClass,
      hobby,
      name,
      phoneNumber,
    } = personalInfo;

    const hashedPassword = await bcrypt.hash(password, 10);

    const res = await db.account.update({
      data: {
        image,
        address,
        name,
        username,
        password: hashedPassword,
        onboarded: true,
        phoneNumber,
        student: {
          update: {
            where: {
              accountId: session.user.id,
            },
            data: {
              ambition,
              birthPlace,
              dateOfBirth,
              educationInstitution,
              gender: gender!,
              gradeClass,
              hobby,
            },
          },
        },
      },
      where: {
        id: session.user.id,
      },
    });

    return res;
  } catch (error: any) {
    throw new Error(`Failed to onboard student: ${error.message}`);
  }
};

'use server';

import { db } from '@/lib/db';
import { AccountDetail } from './_components/InstructorAccountDetailForm';
import { InstructorSchedule } from './_components/InstructorOnboardingStepper';
import { InstructorPersonalInfo } from './_components/InstructorPersonalInfoForm';
import bcrypt from 'bcrypt';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { getNextPeriod } from '@/lib/actions/period.actions';

interface InstructorOnboardingParams {
  accountDetail: AccountDetail;
  instructorPersonalInfo: InstructorPersonalInfo;
  instructorCourses: string[];
  instructorSchedules: InstructorSchedule[];
}

export const handleInstructorOnboarding = async ({
  accountDetail,
  instructorCourses,
  instructorPersonalInfo,
  instructorSchedules,
}: InstructorOnboardingParams) => {
  try {
    const { image, password, username } = accountDetail;
    const {
      address,
      dateOfBirth,
      educationInstitution,
      fileIDCard,
      fileNPWP,
      lastEducation,
      name,
      phoneNumber,
      skills,
    } = instructorPersonalInfo;

    const hashedPassword = await bcrypt.hash(password, 10);

    const period = await getNextPeriod();

    if (!period) throw new Error("There's no period");

    const session = (await getCurrentUser()) as SessionInterface;
    if (!session) throw new Error('Unauthorized user');

    const res = await db.account.update({
      data: {
        image,
        address,
        name,
        onboarded: true,
        password: hashedPassword,
        phoneNumber,
        username,
        instructor: {
          update: {
            where: {
              accountId: session.user.id,
            },
            data: {
              dateOfBirth,
              educationInstitution,
              fileIDCard,
              fileNPWP,
              lastEducation,
              instructorCourses: {
                createMany: {
                  data: instructorCourses.map((courseId) => ({
                    courseId,
                    periodId: period.id,
                  })),
                },
              },
              instructorSchedules: {
                createMany: {
                  data: instructorSchedules.map(({ dayId, shiftId }) => ({
                    dayId,
                    shiftId,
                    periodId: period.id,
                  })),
                },
              },
              skills: {
                set: skills.map((skillId) => ({
                  id: skillId,
                })),
              },
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
    throw new Error(`Failed to onboard instructor: ${error.message}`);
  }
};

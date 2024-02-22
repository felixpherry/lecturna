import { db } from '@/lib/db';
import InstructorOnboardingStepper from './_components/InstructorOnboardingStepper';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { Account, Instructor } from '@prisma/client';

const getInstructorData = async (session: SessionInterface) => {
  return (await db.account.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      instructor: {
        include: {
          skills: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  })) as {
    instructor: {
      skills: {
        id: string;
      }[];
    } & Instructor;
  } & Account;
};

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  const [data, skills, days, shifts, courses] = await Promise.all([
    getInstructorData(session),
    db.skill.findMany(),
    db.masterDay.findMany({
      where: {
        isActive: true,
      },
    }),
    db.masterShift.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    }),
    db.course.findMany({
      where: {
        isPublished: true,
        isDeleted: false,
        program: {
          isPublished: true,
          isDeleted: false,
        },
      },
    }),
  ]);

  return (
    <div className='flex flex-col gap-3'>
      <InstructorOnboardingStepper
        data={data}
        skills={skills}
        days={days}
        shifts={shifts}
        courses={courses}
      />
    </div>
  );
};

export default Page;

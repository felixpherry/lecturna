import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { notFound, redirect } from 'next/navigation';
import AssessmentTable from './_components/AssessmentTable';

interface PageProps {
  params: {
    classId: string;
  };
}

const Page = async ({ params: { classId } }: PageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session || session.user.role !== 'INSTRUCTOR') return notFound();

  const classData = await db.class.findUnique({
    where: {
      id: classId,
      instructorSchedule: {
        instructor: { accountId: session.user.id },
      },
    },
    include: {
      studentCourses: {
        include: {
          student: {
            include: {
              account: true,
              sessionReports: {
                include: {
                  schedule: true,
                },
              },
            },
          },
        },
      },
      studentScores: true,

      _count: {
        select: {
          schedules: true,
        },
      },
    },
  });

  if (!classData) return redirect('/classes');

  const evaluationList = await db.courseEvaluation.findMany({
    where: {
      courseId: classData.courseId,
      isActive: true,
    },
  });

  return (
    <AssessmentTable classData={classData} evaluationList={evaluationList} />
  );
};

export default Page;

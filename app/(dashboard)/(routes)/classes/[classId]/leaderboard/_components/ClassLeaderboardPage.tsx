import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ClassLeaderboardPageProps {
  classId: string;
}

type EvaluationID = string;
type EvaluationWeight = number;

const ClassLeaderboardPage = async ({ classId }: ClassLeaderboardPageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  const classData = await db.class.findUnique({
    where: {
      OR: [
        {
          instructorSchedule: {
            instructor: {
              accountId: session.user.id,
            },
          },
        },
        {
          studentCourses: {
            some: {
              student: {
                accountId: session.user.id,
              },
            },
          },
        },
        {
          studentCourses: {
            some: {
              student: {
                parent: {
                  accountId: session.user.id,
                },
              },
            },
          },
        },
      ],
      id: classId,
    },
    include: {
      studentScores: true,
      _count: {
        select: {
          schedules: true,
        },
      },
      course: {
        include: {
          evaluations: true,
        },
      },
    },
  });

  if (!classData) return notFound();

  const evaluationsMap = classData.course.evaluations.reduce((acc, curr) => {
    acc[curr.id] = curr.weight;
    return acc;
  }, {} as Record<EvaluationID, EvaluationWeight>);

  const sessionReportEvaluation = classData.course.evaluations.find(
    (evaluation) => evaluation.isSessionReport
  );

  const sessionReports = await db.sessionReport.findMany({
    where: {
      schedule: {
        classId,
      },
    },
  });

  const students = await db.student.findMany({
    where: {
      studentCourses: {
        some: {
          classId,
        },
      },
    },
    include: {
      account: true,
    },
  });

  const leaderboard = students
    .map((student) => {
      const avgScore =
        classData.studentScores.reduce(
          (acc, curr) =>
            acc +
            (curr.studentId === student.id
              ? (curr.score * (evaluationsMap[curr.evaluationId] || 0)) / 100
              : 0),
          0
        ) +
        sessionReports.reduce(
          (acc, curr) =>
            acc +
            (curr.studentId === student.id
              ? ((curr.score / classData._count.schedules) *
                  (sessionReportEvaluation?.weight || 0)) /
                100
              : 0),
          0
        );
      return {
        name: student!.account.name,
        student: student,
        avgScore,
      };
    })
    .sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div className='p-5 rounded-md shadow bg-white'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-primary'>Rank</TableHead>
              <TableHead className='text-primary'>Name</TableHead>
              <TableHead className='text-primary'>Student ID</TableHead>
              <TableHead className='text-primary text-center'>
                Average
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map(({ name, student, avgScore }, idx) => (
              <TableRow key={student?.studentId}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  <div className='flex gap-5 items-center'>
                    <Image
                      src={student?.account.image || '/avatar-fallback.svg'}
                      alt={student?.account.name || ''}
                      width={25}
                      height={25}
                      className='rounded-full'
                    />
                    <div className='flex flex-col'>
                      <h3 className='text-primary text-sm font-semibold'>
                        {student?.account.name}
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        {student?.account.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='font-semibold'>
                  {student?.studentId}
                </TableCell>
                <TableCell className='text-center'>
                  <Badge variant='sky-lighten'>{Math.round(avgScore)}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!leaderboard.length && (
          <div className='w-full bg-secondary text-center text-sm text-primary p-3'>
            No Data
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassLeaderboardPage;

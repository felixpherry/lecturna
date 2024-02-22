import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getChildAccountId } from '@/lib/actions/parent.actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { Switch, rem } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
  params: {
    classId: string;
  };
}

const Page = async ({ params: { classId } }: PageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  const studentAccountId =
    session.user.role === 'STUDENT'
      ? session.user.id
      : await getChildAccountId(session.user.id);

  if (!studentAccountId) return notFound();

  const [studentAccount, classData] = await Promise.all([
    db.account.findUnique({
      where: { id: studentAccountId },
    }),
    db.class.findFirst({
      where: {
        id: classId,
        studentCourses: {
          some: {
            student: {
              accountId: studentAccountId,
            },
          },
        },
      },
      include: {
        studentScores: {
          where: {
            student: {
              accountId: studentAccountId,
            },
          },
          include: {
            evaluation: true,
          },
        },
        schedules: {
          include: {
            sessionReports: {
              where: {
                student: {
                  accountId: studentAccountId,
                },
              },
              orderBy: {
                schedule: {
                  sessionNumber: 'asc',
                },
              },
            },
          },
        },
      },
    }),
  ]);

  if (!studentAccount || !classData) return notFound();

  const sessionReportEvaluation = await db.courseEvaluation.findFirst({
    where: {
      courseId: classData.courseId,
      isSessionReport: true,
    },
  });

  if (!sessionReportEvaluation) return notFound();

  const avgScore =
    classData.studentScores.reduce(
      (acc, curr) => acc + (curr.score * curr.evaluation.weight) / 100,
      0
    ) +
    classData.schedules.reduce(
      (acc, curr) =>
        acc +
        (((curr.sessionReports[0]?.score || 0) / classData.schedules.length) *
          sessionReportEvaluation.weight) /
          100,
      0
    );

  const gradeCategory = await db.masterGrade.findFirst({
    where: {
      isActive: true,
      minScore: {
        lte: avgScore,
      },
      maxScore: {
        gte: avgScore,
      },
    },
  });

  return (
    <div className='flex flex-col gap-8 rounded-md bg-white shadow p-5'>
      <div className='w-full border shadow rounded-md flex flex-col bg-white'>
        <div className='flex items-center gap-5 bg-secondary p-5'>
          <Image
            src={studentAccount.image || '/avatar-fallback.svg'}
            alt={studentAccount.name}
            width={130}
            height={130}
            className='rounded-full w-20 h-20'
          />
          <div className='flex flex-col gap-3 items-start'>
            <h3 className='font-bold text-2xl text-primary'>
              {studentAccount.name}
            </h3>
            <Badge
              variant='outline'
              style={{ backgroundColor: gradeCategory!.hexCode }}
              className='text-white'
            >
              Score {Math.round(avgScore)}
            </Badge>
          </div>
        </div>
        <div className='p-5'>
          <p className='text-muted-foreground'>
            This is a brief about the student&apos;s performance, strengths,
            areas of improvements, etc.
          </p>
        </div>
      </div>
      <div className='w-full border shadow rounded-md flex flex-col bg-white'>
        <div className='flex flex-col items-center justify-center gap-2 bg-secondary p-5'>
          <h3 className='font-bold text-2xl text-primary'>Score Details</h3>
          <p className='font-medium text-lg'>
            Average Score: <b>{Math.round(avgScore || 0)}</b>
          </p>
        </div>
        <div className='p-5 flex flex-col gap-5'>
          <h3 className='text-muted-foreground font-bold text-lg'>
            Session Reports
          </h3>
          <Table className='border'>
            <TableHeader>
              <TableRow>
                <TableHead className='text-primary'>No.</TableHead>
                <TableHead className='text-primary'>Session</TableHead>
                <TableHead className='text-primary'>Attendance</TableHead>
                <TableHead className='text-primary'>Score</TableHead>
                <TableHead className='text-primary'>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classData.schedules.map(
                ({ id, sessionReports, sessionNumber }, idx) => (
                  <TableRow key={id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className='font-semibold'>
                      Session {sessionNumber}
                    </TableCell>
                    <TableCell>
                      <Switch
                        color='teal'
                        size='md'
                        checked={sessionReports[0]?.attendanceStatus || false}
                        readOnly
                        thumbIcon={
                          sessionReports[0]?.attendanceStatus ? (
                            <IconCheck
                              style={{ width: rem(12), height: rem(12) }}
                              className='text-teal-400'
                              stroke={3}
                            />
                          ) : (
                            <IconX
                              style={{ width: rem(12), height: rem(12) }}
                              className='text-rose-500'
                              stroke={3}
                            />
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>{sessionReports[0]?.score || '-'}</TableCell>
                    <TableCell>{sessionReports[0]?.feedback || '-'}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>

          <h3 className='text-muted-foreground font-bold text-lg'>
            Final Reports
          </h3>
          <Table className='border'>
            <TableHeader>
              <TableRow>
                <TableHead className='text-primary'>No.</TableHead>
                <TableHead className='text-primary'>Evaluation</TableHead>
                <TableHead className='text-primary'>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classData.studentScores.map(({ id, evaluation, score }, idx) => (
                <TableRow key={id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className='font-semibold'>
                    {evaluation.name} ({evaluation.weight}%)
                  </TableCell>
                  <TableCell>{score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className='flex items-center justify-end gap-1 p-5 bg-secondary font-medium'>
          <p className='text-primary text-lg'>
            Average Score (Overall): <b>{Math.round(avgScore)}</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

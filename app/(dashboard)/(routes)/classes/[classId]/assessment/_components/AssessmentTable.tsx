'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  Account,
  Class,
  CourseEvaluation,
  Schedule,
  SessionReport,
  Student,
  StudentCourse,
  StudentScore,
} from '@prisma/client';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import AssessmentForm from './AssessmentForm';

interface AssessmentTableProps {
  classData: {
    studentCourses: ({
      student: {
        account: Account;
        sessionReports: (SessionReport & { schedule: Schedule })[];
      } & Student;
    } & StudentCourse)[];
    studentScores: StudentScore[];
    _count: {
      schedules: number;
    };
  } & Class;
  evaluationList: CourseEvaluation[];
}

type EvaluationID = string;
type EvaluationWeight = number;
type StudentID = string;
type SessionReports = ({ schedule: Schedule } & SessionReport)[];

const AssessmentTable = ({
  classData,
  evaluationList,
}: AssessmentTableProps) => {
  const [search, setSearch] = useState('');
  const students = classData.studentCourses.map(({ student }) => student);
  const filteredStudents = students.filter(
    ({ account: { email, name, username } }) =>
      email.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      username?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  const sessionsHeader: string[] = new Array(classData._count.schedules)
    .fill(0)
    .map((_, idx) => `Session ${idx + 1}`);

  const evaluations = evaluationList.filter(
    ({ isSessionReport }) => !isSessionReport
  );

  const evaluationsMap = evaluations.reduce((acc, curr) => {
    acc[curr.id] = curr.weight;
    return acc;
  }, {} as Record<EvaluationID, EvaluationWeight>);

  const sessionReportEvaluation = evaluationList.find(
    ({ isSessionReport }) => isSessionReport
  )!;

  const sessionReports = students.reduce((acc, { id, sessionReports }) => {
    acc[id] = sessionReports;

    return acc;
  }, {} as Record<StudentID, SessionReports>);

  const findSessionReportScore = (studentId: string, sessionNumber: number) => {
    return (
      sessionReports[studentId]?.find(
        ({ schedule }) => schedule.sessionNumber === sessionNumber
      )?.score || '-'
    );
  };

  const findOtherEvaluationScore = (
    studentId: string,
    evaluationId: string
  ) => {
    return (
      classData.studentScores.find(
        (score) =>
          score.studentId === studentId && score.evaluationId === evaluationId
      )?.score || '-'
    );
  };

  const getAvgScore = (id: string) => {
    return Math.round(
      classData.studentScores
        .filter((score) => score.studentId === id)
        .reduce((acc, curr) => {
          return (
            acc + (curr.score * (evaluationsMap[curr.evaluationId] || 0)) / 100
          );
        }, 0) +
        ((sessionReports[id].reduce((acc, curr) => acc + curr.score, 0) /
          classData._count.schedules) *
          sessionReportEvaluation.weight) /
          100
    );
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-8 items-center bg-white shadow rounded-sm p-5'>
        <div className='flex gap-[10px] items-center'>
          <p className='text-muted-foreground font-bold'>Students</p>
          <Input
            placeholder='Search students...'
            className='w-60'
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </div>
        <Button
          onClick={() =>
            modals.open({
              title: (
                <h1 className='text-primary text-lg font-semibold'>
                  Assessment
                </h1>
              ),
              fullScreen: true,
              children: (
                <AssessmentForm evaluations={evaluations} students={students} />
              ),
            })
          }
          className='ml-auto'
          size='sm'
          variant='primary-blue'
        >
          <Plus className='h-4 w-4' />
          Add
        </Button>
      </div>
      <div className='flex gap-8 items-center bg-white shadow rounded-sm p-5'>
        <Table className='border rounded-md'>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className='text-primary'>
                No.
              </TableHead>
              <TableHead rowSpan={2} className='text-primary border-l'>
                Student
              </TableHead>
              <TableHead rowSpan={2} className='text-primary border-l'>
                Student ID
              </TableHead>
              {sessionsHeader.map((session) => (
                <TableHead
                  key={session}
                  rowSpan={1}
                  className='text-primary whitespace-nowrap border-l'
                >
                  {session}
                </TableHead>
              ))}
              {evaluations.map(({ name, id }) => (
                <TableHead
                  key={id}
                  rowSpan={1}
                  className='text-primary whitespace-nowrap border-l'
                >
                  {name}
                </TableHead>
              ))}
              <TableHead rowSpan={2} className='text-primary border-l'>
                Average
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead
                colSpan={sessionsHeader.length}
                rowSpan={1}
                className='text-primary font-bold whitespace-nowrap text-center border-l'
              >
                {sessionReportEvaluation.weight}%
              </TableHead>
              {evaluations.map(({ weight, id }) => (
                <TableHead
                  key={id}
                  rowSpan={1}
                  className='text-primary font-bold whitespace-nowrap text-center border-l'
                >
                  {weight}%
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map(({ id, account, studentId }, idx) => (
              <TableRow key={id}>
                <TableCell className='border'>{idx + 1}</TableCell>
                <TableCell className='text-primary whitespace-nowrap font-semibold border'>
                  {account.name}
                </TableCell>
                <TableCell className='text-primary font-semibold border'>
                  {studentId}
                </TableCell>
                {sessionsHeader.map((_, idx) => (
                  <TableCell
                    key={idx}
                    className='border text-center text-muted-foreground font-medium'
                  >
                    {findSessionReportScore(id, idx)}
                  </TableCell>
                ))}
                {evaluations.map((evaluation) => (
                  <TableCell
                    key={evaluation.id}
                    className='border text-center text-muted-foreground font-medium'
                  >
                    {findOtherEvaluationScore(id, evaluation.id)}
                  </TableCell>
                ))}
                <TableCell className='text-primary font-semibold border text-center'>
                  {getAvgScore(id)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssessmentTable;

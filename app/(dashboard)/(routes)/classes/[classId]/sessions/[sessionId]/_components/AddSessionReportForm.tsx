'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addSessionReports,
  canFillSessionReports,
  fetchStudents,
  updateSessionReports,
} from '../_actions';
import Image from 'next/image';
import {
  NumberInput,
  Switch,
  Textarea,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, Save } from 'lucide-react';
import { modals } from '@mantine/modals';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { Account, SessionReport, Student } from '@prisma/client';

interface AddSessionReportFormProps {
  scheduleId: string;
  classId: string;
  initialData: Array<
    {
      student: {
        account: Account;
      } & Student;
    } & SessionReport
  >;
}

export interface SessionReportItem {
  id: string | null;
  studentId: string;
  attendanceStatus: boolean;
  score: number;
  feedback: string;
  scheduleId: string;
}

const AddSessionReportForm = ({
  classId,
  scheduleId,
  initialData,
}: AddSessionReportFormProps) => {
  const [sessionReports, setSessionReports] = useState<SessionReportItem[]>(
    initialData.map(
      ({ studentId, attendanceStatus, score, feedback, scheduleId, id }) => ({
        id,
        attendanceStatus,
        feedback,
        scheduleId,
        score,
        studentId,
      })
    )
  );

  const [isLoading, setIsLoading] = useState(false);

  const { data: students } = useQuery({
    queryKey: ['students', classId],
    queryFn: ({ queryKey }) => fetchStudents(queryKey[1]),
  });

  const theme = useMantineTheme();

  const { data: canFill } = useQuery({
    queryKey: [
      'canFillSessionReports',
      { scheduleId, action: initialData.length === 0 ? 'ADD' : 'EDIT' },
    ],
    queryFn: async ({ queryKey }) => {
      const { action, scheduleId } = queryKey[1] as {
        scheduleId: string;
        action: 'ADD' | 'EDIT';
      };
      return await canFillSessionReports(scheduleId, action);
    },
    staleTime: 60 * 1000,
  });

  const disabled = !canFill;

  useEffect(() => {
    if (!sessionReports.length) {
      setSessionReports(
        students?.map(({ id }) => ({
          id: null,
          studentId: id,
          attendanceStatus: false,
          score: 0,
          feedback: '',
          scheduleId,
        })) || []
      );
    }
  }, [students, scheduleId, sessionReports]);

  const pathname = usePathname()!;

  const skeletons: React.ReactNode[] = new Array(10).fill(
    <>
      <Skeleton className='h-12 w-1/12' />
      <Skeleton className='h-12 w-4/12' />
      <Skeleton className='h-12 w-2/12' />
      <Skeleton className='h-12 w-1/12' />
      <Skeleton className='h-12 w-1/12' />
      <Skeleton className='h-12 w-3/12' />
    </>
  );

  const queryClient = useQueryClient();

  if (!sessionReports.length || !students)
    return (
      <div className='py-5 flex flex-col gap-3'>
        {skeletons.map((item, idx) => (
          <div key={idx} className='flex gap-3'>
            {item}
          </div>
        ))}
      </div>
    );
  const allStudentsAttend = sessionReports.every(
    ({ attendanceStatus }) => attendanceStatus
  );

  const handleToggle = (id: string) => {
    if (disabled) return;
    setSessionReports((prev) =>
      prev.map((curr) => {
        if (curr.studentId === id)
          return {
            ...curr,
            attendanceStatus: !curr.attendanceStatus,
            feedback: '',
            score: 0,
          };
        return { ...curr };
      })
    );
  };

  const handleToggleAll = () => {
    if (disabled) return;
    if (allStudentsAttend) {
      setSessionReports((prev) =>
        prev.map((curr) => ({
          ...curr,
          attendanceStatus: false,
          feedback: '',
          score: 0,
        }))
      );
    } else {
      setSessionReports((prev) =>
        prev.map((curr) => ({
          ...curr,
          attendanceStatus: true,
          feedback: '',
          score: 0,
        }))
      );
    }
  };

  const getStudent = (id: string) => {
    const student = sessionReports.find((student) => student.studentId === id);

    return student!;
  };

  const isStudentAttend = (id: string) => {
    return !!getStudent(id)?.attendanceStatus;
  };

  const handleFormChange = (
    id: string,
    name: 'score' | 'feedback',
    val: number | string
  ) => {
    setSessionReports((prev) =>
      prev.map((curr) =>
        curr.studentId === id ? { ...curr, [name]: val } : { ...curr }
      )
    );
  };

  const handleSubmit = async () => {
    if (disabled) return;
    setIsLoading(true);
    try {
      if (!initialData.length) {
        const { error, message } = await addSessionReports({
          pathname,
          sessionReports,
        });
        if (error !== null) throw new Error(message);
        toast.success(message);
      } else {
        const { error, message } = await updateSessionReports({
          pathname,
          sessionReports,
        });
        if (error !== null) throw new Error(message);
        toast.success(message);
      }

      queryClient.invalidateQueries({
        queryKey: ['student-reports'],
      });

      modals.closeAll();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='py-5 flex flex-col gap-5'>
      <div className='p-3 bg-yellow-200 flex items-center gap-3'>
        <div className='flex items-center'>
          <AlertTriangle />
        </div>
        <p className='text-zinc-600'>
          The <b>deadline</b> for submitting session reports is <b>24 hours</b>{' '}
          after the session. You have a <b>7-day</b> window for edits after
          submission.
        </p>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-primary'>No.</TableHead>
              <TableHead className='text-primary'>Name</TableHead>
              <TableHead className='text-primary'>Student ID</TableHead>
              <TableHead className='flex flex-col items-center text-primary gap-1'>
                Attend
                <Switch
                  checked={allStudentsAttend}
                  onChange={handleToggleAll}
                  color='teal'
                  size='md'
                  thumbIcon={
                    allStudentsAttend ? (
                      <IconCheck
                        style={{ width: rem(12), height: rem(12) }}
                        color={theme.colors.teal[6]}
                        stroke={3}
                      />
                    ) : (
                      <IconX
                        style={{ width: rem(12), height: rem(12) }}
                        color={theme.colors.red[6]}
                        stroke={3}
                      />
                    )
                  }
                />
              </TableHead>
              <TableHead className='text-primary'>Score</TableHead>
              <TableHead className='text-primary'>Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students!.map(({ id, account, studentId }, idx) => (
              <TableRow key={id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  <div className='flex gap-5 items-center'>
                    <Image
                      src={account.image || '/avatar-fallback.svg'}
                      alt={account.name || ''}
                      width={25}
                      height={25}
                      className='rounded-full'
                    />
                    <div className='flex flex-col'>
                      <h3 className='text-primary text-sm font-semibold'>
                        {account.name}
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        {account.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='font-semibold'>{studentId}</TableCell>
                <TableCell>
                  <Switch
                    className='w-fit mx-auto'
                    checked={isStudentAttend(id)}
                    onChange={() => handleToggle(id)}
                    color='teal'
                    size='md'
                    thumbIcon={
                      isStudentAttend(id) ? (
                        <IconCheck
                          style={{ width: rem(12), height: rem(12) }}
                          color={theme.colors.teal[6]}
                          stroke={3}
                        />
                      ) : (
                        <IconX
                          style={{ width: rem(12), height: rem(12) }}
                          color={theme.colors.red[6]}
                          stroke={3}
                        />
                      )
                    }
                    readOnly={disabled}
                  />
                </TableCell>
                <TableCell>
                  <NumberInput
                    className='w-14'
                    min={0}
                    max={100}
                    disabled={!isStudentAttend(id) || disabled}
                    hideControls
                    value={getStudent(id)?.score}
                    onChange={(v) => handleFormChange(id, 'score', v)}
                  />
                </TableCell>
                <TableCell>
                  <Textarea
                    disabled={!isStudentAttend(id) || disabled}
                    value={getStudent(id)?.feedback}
                    onChange={(e) =>
                      handleFormChange(id, 'feedback', e.currentTarget.value)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='ml-auto flex gap-3'>
        <Button onClick={() => modals.closeAll()} variant='outline' size='sm'>
          Close
        </Button>
        {!disabled && (
          <Button onClick={handleSubmit} size='sm'>
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Save className='h-4 w-4' />
            )}
            Save
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddSessionReportForm;

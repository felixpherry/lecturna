'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchStudentReports } from '../_actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { modals } from '@mantine/modals';
import { Switch, rem, useMantineTheme } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StudentReportParams {
  studentId: string;
  classId: string;
}

const StudentReport = ({ classId, studentId }: StudentReportParams) => {
  const {
    data: studentReports,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['student-reports', { classId, studentId }],
    queryFn: () => fetchStudentReports(classId, studentId),
  });

  const theme = useMantineTheme();

  const skeletons: React.ReactNode[] = new Array(5).fill(
    <>
      <Skeleton className='h-12 w-1/12' />
      <Skeleton className='h-12 w-3/12' />
      <Skeleton className='h-12 w-3/12' />
      <Skeleton className='h-12 w-1/12' />
      <Skeleton className='h-12 w-4/12' />
    </>
  );

  if (isLoading) {
    return (
      <div className='py-5 flex flex-col gap-3'>
        {skeletons.map((item, idx) => (
          <div key={idx} className='flex gap-3'>
            {item}
          </div>
        ))}
      </div>
    );
  }

  if (isError) return <>Error</>;

  return (
    <div className='pt-5 flex flex-col gap-5'>
      <div className='rounded-md border'>
        <Table>
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
            {studentReports!.map(
              ({ id, score, feedback, attendanceStatus, schedule }, idx) => (
                <TableRow key={id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className='font-semibold'>
                    Session {schedule.sessionNumber}
                  </TableCell>
                  <TableCell>
                    <Switch
                      color='teal'
                      size='md'
                      checked={attendanceStatus}
                      readOnly
                      thumbIcon={
                        attendanceStatus ? (
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
                    {/* <CheckCircle className='w-4 h-4 bg-green-500' /> */}
                  </TableCell>
                  <TableCell>{score}</TableCell>
                  <TableCell>{feedback}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        {!studentReports!.length && (
          <div className='w-full bg-secondary text-center text-sm text-primary p-3'>
            No Data
          </div>
        )}
      </div>
      <div className='ml-auto flex gap-3'>
        <Button onClick={() => modals.closeAll()} variant='outline' size='sm'>
          Close
        </Button>
      </div>
    </div>
  );
};

export default StudentReport;

'use client';

import { modals } from '@mantine/modals';
import { CalendarPlus } from 'lucide-react';
import AddSessionReportForm from './AddSessionReportForm';
import { Account, SessionReport, Student } from '@prisma/client';

interface SessionReportModalProps {
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

const SessionReportModal = ({
  scheduleId,
  classId,
  initialData,
}: SessionReportModalProps) => {
  return (
    <span
      onClick={() =>
        modals.open({
          title: (
            <h1 className='text-primary text-lg font-semibold'>
              Session Report
            </h1>
          ),
          fullScreen: true,
          children: (
            <AddSessionReportForm
              classId={classId}
              scheduleId={scheduleId}
              initialData={initialData}
            />
          ),
        })
      }
      className='flex items-center gap-3 p-3 rounded-md hover:bg-sky-200/20 cursor-pointer'
    >
      <CalendarPlus className='h-4 w-4' />
      <span>Session Report</span>
    </span>
  );
};

export default SessionReportModal;

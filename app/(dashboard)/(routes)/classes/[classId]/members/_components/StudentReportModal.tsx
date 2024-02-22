'use client';

import { Button } from '@/components/ui/button';
import { modals } from '@mantine/modals';
import StudentReport from './StudentReport';

interface StudentReportModalParams {
  classId: string;
  studentId: string;
}

const StudentReportModal = ({
  classId,
  studentId,
}: StudentReportModalParams) => {
  const handleOpenReport = () => {
    modals.open({
      title: (
        <h1 className='text-primary text-lg font-semibold'>Student Report</h1>
      ),
      size: 'xl',
      children: <StudentReport classId={classId} studentId={studentId} />,
    });
  };

  return (
    <Button onClick={handleOpenReport} size='sm' className='w-fit mx-auto'>
      Details
    </Button>
  );
};

export default StudentReportModal;

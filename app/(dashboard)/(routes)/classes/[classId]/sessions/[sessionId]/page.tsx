import { Suspense } from 'react';
import ClassSessionPage from './_components/ClassSessionPage';
import ClassSessionFallback from './_components/ClassSessionFallback';

interface PageProps {
  params: {
    classId: string;
    sessionId: string;
  };
}

const Page = async ({ params: { classId, sessionId } }: PageProps) => {
  return (
    <Suspense fallback={<ClassSessionFallback />}>
      <ClassSessionPage classId={classId} sessionId={sessionId} />
    </Suspense>
  );
};

export default Page;

import { Suspense } from 'react';
import ClassLeaderboardPage from './_components/ClassLeaderboardPage';
import ClassLeaderboardFallback from './_components/ClassLeaderboardFallback';

interface PageProps {
  params: {
    classId: string;
  };
}

const Page = async ({ params: { classId } }: PageProps) => {
  return (
    <Suspense fallback={<ClassLeaderboardFallback />}>
      <ClassLeaderboardPage classId={classId} />
    </Suspense>
  );
};

export default Page;

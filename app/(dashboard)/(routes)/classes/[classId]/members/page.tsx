import { Suspense } from 'react';
import ClassMembersFallback from './_components/ClassMembersFallback';
import ClassMembersPage from './_components/ClassMembersPage';

interface PageProps {
  params: {
    classId: string;
  };
}

const Page = async ({ params: { classId } }: PageProps) => {
  return (
    <Suspense fallback={<ClassMembersFallback />}>
      <ClassMembersPage classId={classId} />
    </Suspense>
  );
};

export default Page;

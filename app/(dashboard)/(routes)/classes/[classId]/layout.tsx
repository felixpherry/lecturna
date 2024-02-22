import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ClassDetailTabs from './_components/ClassDetailTabs';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    classId: string;
  };
}

const Layout = async ({ children, params: { classId } }: LayoutProps) => {
  const classData = await db.class.findUnique({
    where: {
      id: classId,
    },
    include: {
      course: true,
      schedules: true,
    },
  });

  if (!classData) return notFound();

  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return notFound();

  const isObserver =
    session.user.role !== 'INSTRUCTOR' && session.user.role !== 'STUDENT';

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-muted-foreground font-bold text-lg'>
          {classData.course.name} - {classData.name}
        </h1>
        <div className='flex items-center gap-2'>
          <Link
            href={session.user.role === 'ADMIN' ? '/admin/classes' : '/classes'}
            className='text-xs font-normal text-primary'
          >
            {isObserver ? 'Classes' : 'My Classes'}
          </Link>
          <ChevronRight className='h-3 w-3 text-muted-foreground' />
          <p className='text-xs font-nomal text-muted-foreground'>
            Class Details
          </p>
        </div>
      </div>
      <ClassDetailTabs classId={classId} session={session} />
      {children}
    </div>
  );
};

export default Layout;

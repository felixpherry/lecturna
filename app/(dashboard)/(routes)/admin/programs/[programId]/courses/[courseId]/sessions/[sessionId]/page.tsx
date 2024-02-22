import { getCurrentUser } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

import Link from 'next/link';
import { ArrowLeft, File, LayoutDashboard } from 'lucide-react';
import IconBadge from '@/components/shared/IconBadge';

import { fetchSessionById } from '@/lib/actions/program.actions';
import SessionMainForm from './_components/SessionMainForm';
import SessionDescriptionForm from './_components/SessionDescriptionForm';
import ReferencesForm from './_components/ReferencesForm';
import Banner from '@/components/shared/Banner';
import SessionActions from './_components/SessionActions';
import AttachmentList from './_components/AttachmentList';

const Page = async ({
  params: { programId, courseId, sessionId },
}: {
  params: {
    programId: string;
    courseId: string;
    sessionId: string;
  };
}) => {
  const userSession = await getCurrentUser();
  if (!userSession) return redirect('/');

  const session = await fetchSessionById({
    courseId,
    sessionId,
  });

  if (!session) return notFound();

  const requiredFields = [session.main, session.description];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!session.isPublished && (
        <Banner variant='warning' label='This session is a draft' />
      )}
      <div className='container max-w-7xl p-0'>
        <div className='flex items-center justify-between'>
          <div className='w-full'>
            <Link
              href={`/admin/programs/${programId}/courses/${courseId}`}
              className='flex items-center text-sm hover:opacity-75 transition mb-6'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </Link>
            <div className='flex items-center justify-between w-full'>
              <div className='flex flex-col gap-y-2'>
                <h1 className='text-2xl font-medium'>Session Setup</h1>
                <span className='text-sm text-slate-700'>
                  Complete all fields {completionText}
                </span>
              </div>
              <SessionActions
                disabled={!isComplete}
                session={session}
                programId={programId}
              />
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div className='space-y-4'>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={LayoutDashboard} />
                <h2 className='text-xl'>Customize Session</h2>
              </div>
              <SessionMainForm initialData={session} />
              <SessionDescriptionForm initialData={session} />
              <ReferencesForm initialData={session} />
            </div>
          </div>
          <div className='space-y-6'>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={File} />
                <h2 className='text-xl'>Attachments & Resources</h2>
              </div>
              <AttachmentList attachments={session.attachments} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;

import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { notFound, redirect } from 'next/navigation';
import { Fragment } from 'react';

interface PageProps {
  params: {
    classId: string;
  };
}

const Page = async ({ params: { classId } }: PageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  const classData = await db.class.findUnique({
    where: {
      id: classId,
      OR: [
        {
          instructorSchedule: {
            instructor: {
              accountId: session.user.id,
            },
          },
        },
        {
          studentCourses: {
            some: {
              student: {
                accountId: session.user.id,
              },
            },
          },
        },
      ],
    },
    include: {
      studentCourses: {
        include: {
          student: true,
        },
      },
      instructorSchedule: {
        include: {
          instructor: true,
        },
      },
    },
  });

  if (!classData) return redirect('/not-found');

  const member =
    session.user.role === 'STUDENT'
      ? classData.studentCourses.find(
          ({ student }) => student.accountId === session.user.id
        )?.student
      : classData.instructorSchedule?.instructor;

  if (!member) return redirect('/not-found');

  return (
    <div className=' flex flex-col h-full'>
      <Fragment>
        <ChatMessages
          member={member}
          name={classData.name}
          apiUrl='/api/messages'
          socketUrl='/api/socket/messages'
          socketQuery={{
            classId,
          }}
          classId={classId}
        />
        <ChatInput
          apiUrl='/api/socket/messages'
          query={{
            classId,
          }}
        />
      </Fragment>
    </div>
  );
};

export default Page;

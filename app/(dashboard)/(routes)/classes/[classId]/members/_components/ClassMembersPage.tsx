import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import ClassMemberCard from './ClassMemberCard';

interface ClassMembersPageProps {
  classId: string;
}

const ClassMembersPage = async ({ classId }: ClassMembersPageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return notFound();

  const classData = await db.class.findUnique({
    where:
      session.user.role === 'ADMIN'
        ? {
            id: classId,
          }
        : {
            OR: [
              {
                studentCourses: {
                  some: {
                    student: {
                      accountId: session?.user.id,
                    },
                  },
                },
              },
              {
                instructorSchedule: {
                  instructor: {
                    accountId: session?.user.id,
                  },
                },
              },
            ],
            id: classId,
          },
    include: {
      instructorSchedule: {
        include: {
          instructor: {
            include: {
              account: true,
            },
          },
        },
      },
      studentCourses: {
        include: {
          student: {
            include: {
              account: true,
            },
          },
        },
      },
    },
  });

  if (!classData) return notFound();

  const instructor = classData.instructorSchedule?.instructor;

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-xl font-semibold'>Instructor</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          <ClassMemberCard
            type='INSTRUCTOR'
            name={instructor?.account.name || ''}
            email={instructor?.account.email || ''}
            image={instructor?.account.image || ''}
          />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <h3 className='text-xl font-semibold'>Students</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {classData.studentCourses.map(({ id, student }) => (
            <ClassMemberCard
              key={id}
              id={student.id}
              type='STUDENT'
              classId={classId}
              name={student.account.name}
              email={student.account.email}
              image={student.account.image || ''}
              studentId={student.studentId}
              session={session}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassMembersPage;

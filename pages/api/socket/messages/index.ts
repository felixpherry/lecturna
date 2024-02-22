import { db } from '@/lib/db';
import { authOptions } from '@/lib/session';
import { NextApiResponseServerIo, SessionInterface } from '@/types';
import { NextApiRequest } from 'next';
import { getServerSession } from 'next-auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = (await getServerSession(
      req,
      res,
      authOptions
    )) as SessionInterface;
    const { content, fileUrl, fileKey } = JSON.parse(req.body);

    const { classId } = req.query;

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!classId) {
      return res.status(401).json({ error: 'Class ID is missing' });
    }

    if (!content) {
      return res.status(401).json({ error: 'Content is missing' });
    }

    const classData = await db.class.findUnique({
      where: {
        id: classId as string,
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
        instructorSchedule: {
          include: {
            instructor: true,
          },
        },
        studentCourses: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!classData) return res.status(404).json({ message: 'Class not found' });

    const member =
      session.user.role === 'INSTRUCTOR'
        ? classData.instructorSchedule?.instructor
        : classData.studentCourses.find(
            ({ student }) => student.accountId === session.user.id
          )?.student;

    if (!member) return res.status(404).json({ message: 'Member not found' });

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        fileKey: fileKey || null,
        classId: classId as string,
        [session.user.role === 'INSTRUCTOR' ? 'instructorId' : 'studentId']:
          member.id,
      },
      include: {
        instructor: {
          include: {
            account: true,
          },
        },
        student: {
          include: {
            account: true,
          },
        },
      },
    });

    const classKey = `chat:${classId}:messages`;

    res?.socket?.server?.io?.emit(classKey, message);

    return res.status(200).json(message);
  } catch (error: any) {
    console.log('[MESSAGES_POST]', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

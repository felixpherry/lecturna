import { utapi } from '@/app/api/uploadthing/core';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/session';
import { NextApiResponseServerIo, SessionInterface } from '@/types';
import { NextApiRequest } from 'next';
import { getServerSession } from 'next-auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const session = (await getServerSession(
      req,
      res,
      authOptions
    )) as SessionInterface;
    const { messageId, classId } = req.query;
    const { content } = JSON.parse(req.body);

    if (!session) return res.status(401).json({ error: 'Unauthorized' });
    if (!classId) return res.status(400).json({ error: 'Class ID is missing' });
    if (!messageId)
      return res.status(400).json({ error: 'Message ID missing' });

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

    if (!classData) return res.status(404).json({ error: 'Class not found' });

    const member =
      session.user.role === 'INSTRUCTOR'
        ? classData.instructorSchedule?.instructor
        : classData.studentCourses.find(
            ({ student }) => student.accountId === session.user.id
          )?.student;

    if (!member) return res.status(404).json({ message: 'Member not found' });

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        classId: classId as string,
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

    if (!message || message.isDeleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const isMessageOwner =
      (session.user.role === 'INSTRUCTOR' &&
        message.instructorId === member.id) ||
      (session.user.role === 'STUDENT' && message.studentId === member.id);

    const canModify = isMessageOwner;
    if (!canModify) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'DELETE') {
      if (message.fileKey) {
        await utapi.deleteFiles(message.fileKey);
      }
      message = await db.message.update({
        data: {
          isDeleted: true,
          fileUrl: null,
          fileKey: null,
          content: 'This message has been deleted',
        },
        where: { id: messageId as string },
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
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner)
        return res.status(401).json({ error: 'Unauthorized' });

      message = await db.message.update({
        data: {
          content,
        },
        where: { id: messageId as string },
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
    }

    const updateKey = `chat:${classId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log('[MESSAGE_ID]', error);
    return res.status(500).json({ error: 'Internal Error' });
  }
}

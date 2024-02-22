import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';

const MESSAGES_BATCH = 10;

export const GET = async (req: Request) => {
  try {
    const session = (await getCurrentUser()) as SessionInterface;

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const classId = searchParams.get('classId');
    if (!session) return new NextResponse('Unauthorized', { status: 401 });
    if (!classId) return new NextResponse('Class ID missing', { status: 400 });

    let messages: Message[] = [];
    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          classId,
        },
        include: {
          student: {
            include: {
              account: true,
            },
          },
          instructor: {
            include: {
              account: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          classId,
        },
        include: {
          student: {
            include: {
              account: true,
            },
          },
          instructor: {
            include: {
              account: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log('[MESSAGES_GET', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

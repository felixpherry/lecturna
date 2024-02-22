'use server';

import { Program, Session, Course, Prisma } from '@prisma/client';
import { db } from '../db';
import { revalidatePath } from 'next/cache';
import { authorizeByRoles } from '../authorization';
import { utapi } from '@/app/api/uploadthing/core';
import { ServerActionsResponse } from '@/types';

export const fetchPrograms = async (categoryId: string = '') => {
  try {
    return await db.program.findMany({
      where: { isDeleted: false },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch program: ${error.message}`);
  }
};

export const fetchProgramDetail = async (id: string) => {
  try {
    return await db.program.findUnique({
      where: {
        id,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch program detail: ${error.message}`);
  }
};

export const fetchProgramById = async (id: string) => {
  try {
    return await db.program.findUnique({
      where: {
        id,
      },
      include: {
        courses: true,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch program: ${error.message}`);
  }
};

export const createProgram = async ({
  name,
  accountId,
  pathname,
}: {
  name: string;
  accountId: string;
  pathname: string;
}): Promise<ServerActionsResponse<Program>> => {
  try {
    const admin = await db.admin.findUnique({
      where: {
        accountId,
      },
    });

    if (!admin) throw new Error('Unauthorized');
    const program = await db.program.create({
      data: {
        name,
        userId: admin.id,
      },
    });

    revalidatePath(pathname);

    return {
      data: program,
      error: null,
      message: 'Successfully created program',
    };
  } catch (error: any) {
    console.log('createProgram', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Program name must be unique',
        };
      }
    }
    return {
      data: null,
      error: error.message,
      message: 'Failed to create program',
    };
  }
};

export const updateProgram = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Partial<Program>;
  pathname: string;
}): Promise<ServerActionsResponse<Program>> => {
  try {
    const program = await db.program.update({
      data: payload,
      where: {
        id,
      },
    });
    revalidatePath(pathname);

    return {
      data: program,
      error: null,
      message: 'Successfully updated program',
    };
  } catch (error: any) {
    console.log('updateProgram', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Program name must be unique',
        };
      }
    }
    return {
      data: null,
      error: error.message,
      message: 'Failed to update program',
    };
  }
};

export const deleteProgram = async (
  id: string,
  pathname: string
): Promise<ServerActionsResponse<Program>> => {
  try {
    const program = await db.program.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    revalidatePath(pathname);

    return {
      data: program,
      error: null,
      message: 'Successfully deleted program',
    };
  } catch (error: any) {
    console.log('deleteProgram');
    return {
      data: null,
      error: error.message,
      message: 'Failed to delete program',
    };
  }
};

export const fetchCourseById = async ({
  courseId,
  programId,
}: {
  courseId: string;
  programId: string;
}) => {
  try {
    return await db.course.findUnique({
      where: { id: courseId, programId },
      include: {
        sessions: {
          orderBy: {
            sessionNumber: 'asc',
          },
        },
        evaluations: {
          where: {
            isActive: true,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch course: ${error.message}`);
  }
};

export const addCourse = async ({
  name,
  programId,
  pathname,
}: {
  name: string;
  programId: string;
  pathname: string;
}): Promise<ServerActionsResponse<Course>> => {
  try {
    const course = await db.course.create({
      data: {
        name,
        program: {
          connect: {
            id: programId,
          },
        },
      },
    });

    revalidatePath(pathname);
    return {
      data: course,
      error: null,
      message: 'Successfully added course',
    };
  } catch (error: any) {
    console.log('addCourse', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to add course',
    };
  }
};

export const updateCourse = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Partial<Course>;
  pathname: string;
}): Promise<ServerActionsResponse<Course>> => {
  try {
    const course = await db.course.update({
      data: payload,
      where: {
        id,
      },
    });

    if (payload?.isPublished === false && payload.programId) {
      const publishedCoursesInPrograms = await db.course.findMany({
        where: {
          programId: course.programId,
          isPublished: true,
        },
      });

      if (!publishedCoursesInPrograms.length) {
        await db.program.update({
          where: {
            id: course.programId,
          },
          data: {
            isPublished: false,
          },
        });
      }
    }
    revalidatePath(pathname);

    return {
      data: course,
      error: null,
      message: 'Successfully updated course',
    };
  } catch (error: any) {
    console.log('updateCourse', error.message);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          data: null,
          error: error.message,
          message: 'Course name and code must be unique',
        };
      }
    }
    return {
      data: null,
      error: error.message,
      message: 'Failed to update course',
    };
  }
};

export const deleteCourse = async (
  id: string
): Promise<ServerActionsResponse<Course>> => {
  try {
    const course = await db.course.update({
      where: {
        id,
      },
      data: { isDeleted: true },
    });

    const publishedCourseInPrograms = await db.course.findMany({
      where: {
        programId: course.programId,
        isPublished: true,
        isDeleted: false,
      },
    });

    if (!publishedCourseInPrograms.length) {
      await db.program.update({
        where: {
          id: course.programId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return {
      data: course,
      error: null,
      message: 'Successfully deleted course',
    };
  } catch (error: any) {
    console.log('deleteCourse', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to delete course',
    };
  }
};

export const addSession = async ({
  main,
  courseId,
  pathname,
}: {
  main: string;
  courseId: string;
  pathname: string;
}): Promise<ServerActionsResponse<Session>> => {
  try {
    const lastSession = await db.session.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        sessionNumber: 'desc',
      },
    });

    const session = await db.session.create({
      data: {
        main,
        sessionNumber: (lastSession?.sessionNumber || 0) + 1,
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });

    revalidatePath(pathname);
    return {
      data: session,
      error: null,
      message: 'Successfully added session',
    };
  } catch (error: any) {
    console.log('addSession', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to add session',
    };
  }
};

export const reorderSessions = async ({
  updateData,
  pathname,
}: {
  updateData: {
    id: string;
    sessionNumber: number;
  }[];
  pathname: string;
}) => {
  try {
    updateData.forEach(async ({ id, sessionNumber }) => {
      await db.session.update({
        data: {
          sessionNumber,
        },
        where: {
          id,
        },
      });
    });
    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to reorder sessions: ${error.message}`);
  }
};

export const fetchSessionById = async ({
  courseId,
  sessionId,
}: {
  courseId: string;
  sessionId: string;
}) => {
  try {
    return await db.session.findUnique({
      where: {
        id: sessionId,
        courseId: courseId,
      },
      include: {
        attachments: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch session: ${error.message}`);
  }
};

export const updateSession = async ({
  id,
  payload,
  pathname,
}: {
  id: string;
  payload: Partial<Session>;
  pathname: string;
}): Promise<ServerActionsResponse<Session>> => {
  try {
    const session = await db.session.update({
      data: payload,
      where: {
        id,
      },
    });

    if (payload?.isPublished === false && payload.courseId) {
      const publishedSessionsInCourses = await db.session.findMany({
        where: {
          courseId: payload.courseId,
          isPublished: true,
        },
      });

      if (!publishedSessionsInCourses.length) {
        const course = await db.course.update({
          where: {
            id: payload.courseId,
          },
          data: {
            isPublished: false,
          },
        });

        const publishedCoursesInPrograms = await db.course.findMany({
          where: {
            programId: course.programId,
            isPublished: true,
          },
        });

        if (!publishedCoursesInPrograms.length) {
          await db.program.update({
            where: {
              id: course.programId,
            },
            data: {
              isPublished: false,
            },
          });
        }
      }
    }
    revalidatePath(pathname);
    return {
      data: session,
      error: null,
      message: 'Successfully updated session',
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message,
      message: 'Failed to update session',
    };
  }
};

export const deleteSession = async (
  id: string
): Promise<ServerActionsResponse<Session>> => {
  try {
    const session = await db.session.delete({
      where: {
        id,
      },
    });

    const publishedSessionsInCourses = await db.session.findMany({
      where: {
        courseId: session.courseId,
        isPublished: true,
      },
    });

    if (!publishedSessionsInCourses.length) {
      const course = await db.course.update({
        where: {
          id: session.courseId,
        },
        data: {
          isPublished: false,
        },
      });

      const publishedCoursesInPrograms = await db.course.findMany({
        where: {
          programId: course.programId,
          isPublished: true,
        },
      });

      if (!publishedCoursesInPrograms.length) {
        await db.program.update({
          where: {
            id: course.programId,
          },
          data: {
            isPublished: false,
          },
        });
      }
    }

    return {
      data: session,
      error: null,
      message: 'Successfully deleted session',
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message,
      message: 'Failed to delete session',
    };
  }
};

export const addAttachment = async ({
  filename,
  fileUrl,
  fileType,
  sessionId,
  pathname,
}: {
  filename: string;
  fileUrl: string;
  fileType: string;
  sessionId: string;
  pathname: string;
}) => {
  try {
    await db.attachment.create({
      data: {
        filename,
        fileUrl,
        fileType,
        session: {
          connect: {
            id: sessionId,
          },
        },
      },
    });

    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to add attachment: ${error.message}`);
  }
};

export const deleteAttachment = async (id: string, pathname: string) => {
  try {
    await db.attachment.delete({
      where: { id },
    });

    revalidatePath(pathname);
  } catch (error: any) {
    throw new Error(`Failed to delete attachment: ${error.message}`);
  }
};

interface UpdateProgramImageParams {
  programId: string;
  image: string;
  fileKey?: string | null;
  pathname: string;
}

export const updateProgramImage = async ({
  image,
  pathname,
  programId,
  fileKey,
}: UpdateProgramImageParams): Promise<ServerActionsResponse<Program>> => {
  try {
    await authorizeByRoles(['ADMIN']);

    const program = await db.program.findUnique({
      where: {
        id: programId,
      },
    });

    if (!program) {
      throw new Error('Program not found');
    }
    if (program.fileKey) await utapi.deleteFiles(program.fileKey);

    const newProgram = await db.program.update({
      data: {
        image,
        fileKey,
      },
      where: {
        id: programId,
      },
    });

    revalidatePath(pathname);

    return {
      data: newProgram,
      error: null,
      message: 'Successfully updated image',
    };
  } catch (error: any) {
    console.log('updateProgramImage', error.message);
    return {
      data: null,
      error: error.message,
      message: 'Failed to update image',
    };
  }
};

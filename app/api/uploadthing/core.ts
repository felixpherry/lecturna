import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UTApi } from 'uploadthing/server';

const f = createUploadthing();

const handleAuth = async () => {
  const session = (await getCurrentUser()) as SessionInterface;
  if (!session) throw new Error('Unauthorized');
  return {
    userId: session.user.id,
  };
};

export const fileRouter = {
  heroImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
  logoImage: f({ image: { maxFileSize: '1MB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
  programImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
  fileNPWP: f({ image: { maxFileSize: '512KB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
  fileIDCard: f({ image: { maxFileSize: '512KB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
  profilePhoto: f({ image: { maxFileSize: '1MB', maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
  courseAttachment: f({
    image: {
      maxFileSize: '1MB',
      maxFileCount: 1,
    },
    pdf: {
      maxFileSize: '1MB',
      maxFileCount: 1,
    },
    text: {
      maxFileSize: '1MB',
      maxFileCount: 1,
    },
    video: {
      maxFileSize: '1MB',
      maxFileCount: 1,
    },
    audio: {
      maxFileSize: '1MB',
      maxFileCount: 1,
    },
  })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
  otherCourseAttachment: f({
    image: {
      maxFileSize: '1MB',
      maxFileCount: 1,
    },
    pdf: {
      maxFileSize: '1MB',
      maxFileCount: 1,
    },
    text: {
      maxFileSize: '1MB',
      maxFileCount: 1,
    },
    video: {
      maxFileSize: '1MB',
      maxFileCount: 1,
    },
    audio: {
      maxFileSize: '1MB',
      maxFileCount: 1,
    },
  })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
  chatAttachment: f({
    image: { maxFileSize: '1MB', maxFileCount: 1 },
    pdf: { maxFileSize: '1MB', maxFileCount: 1 },
  })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
} satisfies FileRouter;

export type fileRouter = typeof fileRouter;

export const utapi = new UTApi();

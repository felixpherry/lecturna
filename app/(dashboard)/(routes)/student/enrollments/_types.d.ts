import { RegistrationStatus } from '@prisma/client';

export type CourseCatalog = {
  courseId: string;
  name: string;
  sessions: number;
  level: Level;
  image: string | null;
  status: RegistrationStatus | null;
  classId: string | null;
};

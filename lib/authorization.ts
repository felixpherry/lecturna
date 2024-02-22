'use server';

import { Role } from '@prisma/client';
import { getCurrentUser } from './session';
import { SessionInterface } from '@/types';

export const authorizeByRoles = async (roles: Role[]) => {
  const session = (await getCurrentUser()) as SessionInterface;
  if (!session || !roles.some((role) => role === session.user.role))
    throw new Error('Unauthorized');
};

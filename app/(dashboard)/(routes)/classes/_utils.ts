import { Role } from '@prisma/client';
import {
  BookCheck,
  BookCopy,
  CalendarDays,
  LucideIcon,
  MessageCircle,
  Trophy,
  Users,
  Video,
} from 'lucide-react';

const getStudentTabs = (classId: string) => {
  return [
    {
      label: 'Sessions',
      href: `/classes/${classId}/sessions`,
      icon: CalendarDays,
    },
    {
      label: 'Meeting',
      href: `/classes/${classId}/meeting`,
      icon: Video,
    },
    {
      label: 'Chat',
      href: `/classes/${classId}/chat`,
      icon: MessageCircle,
    },
    {
      label: 'Score',
      href: `/classes/${classId}/score`,
      icon: BookCopy,
    },
    {
      label: 'Members',
      href: `/classes/${classId}/members`,
      icon: Users,
    },
    {
      label: 'Leaderboard',
      href: `/classes/${classId}/leaderboard`,
      icon: Trophy,
    },
  ];
};

const getParentTabs = (classId: string) => {
  return [
    {
      label: 'Score',
      href: `/classes/${classId}/score`,
      icon: BookCopy,
    },
    {
      label: 'Leaderboard',
      href: `/classes/${classId}/leaderboard`,
      icon: Trophy,
    },
  ];
};

const getInstructorTabs = (classId: string) => {
  return [
    {
      label: 'Sessions',
      href: `/classes/${classId}/sessions`,
      icon: CalendarDays,
    },
    {
      label: 'Meeting',
      href: `/classes/${classId}/meeting`,
      icon: Video,
    },
    {
      label: 'Chat',
      href: `/classes/${classId}/chat`,
      icon: MessageCircle,
    },
    {
      label: 'Assessment',
      href: `/classes/${classId}/assessment`,
      icon: BookCheck,
    },
    {
      label: 'Members',
      href: `/classes/${classId}/members`,
      icon: Users,
    },
    {
      label: 'Leaderboard',
      href: `/classes/${classId}/leaderboard`,
      icon: Trophy,
    },
  ];
};

const getAdminTabs = (classId: string) => {
  return [
    {
      label: 'Sessions',
      href: `/classes/${classId}/sessions`,
      icon: CalendarDays,
    },
    {
      label: 'Members',
      href: `/classes/${classId}/members`,
      icon: Users,
    },
  ];
};

interface ClassTab {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const getClassTabs = (role: Role, classId: string): ClassTab[] => {
  return {
    [Role.INSTRUCTOR]: getInstructorTabs(classId),
    [Role.STUDENT]: getStudentTabs(classId),
    [Role.PARENT]: getParentTabs(classId),
    [Role.ADMIN]: getAdminTabs(classId),
  }[role];
};

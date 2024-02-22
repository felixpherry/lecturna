'use client';

import { IconTableOptions } from '@tabler/icons-react';
import SidebarItem, { SidebarItemProps } from './SidebarItem';
import {
  BookOpen,
  CalendarDays,
  Code2,
  GraduationCap,
  Layout,
  ScrollText,
  User,
  UserPlus,
  Users,
  Users2,
  Wrench,
} from 'lucide-react';

import { SessionInterface } from '@/types';

const adminRoutes: SidebarItemProps[] = [
  { label: 'Dashboard', icon: Layout, href: '/admin/dashboard' },
  { label: 'Accounts', icon: Users, href: '/admin/accounts' },
  {
    label: 'Master',
    icon: Wrench,
    initiallyOpened: false,
    links: [
      {
        label: 'Category',
        href: '/admin/master/categories',
      },
      {
        label: 'Day',
        href: '/admin/master/day',
      },
      {
        label: 'Period',
        href: '/admin/master/period',
      },
      {
        label: 'Shift',
        href: '/admin/master/shift',
      },
      {
        label: 'Grade',
        href: '/admin/master/grade',
      },
      {
        label: 'Skill',
        href: '/admin/master/skill',
      },
      {
        label: 'Coupon',
        href: '/admin/master/coupon',
      },
    ],
  },
  {
    label: 'First Registrations',
    icon: ScrollText,
    initiallyOpened: false,
    links: [
      {
        label: 'Trial Class',
        href: '/admin/registrations/trial-class',
      },
      {
        label: 'Courses',
        href: '/admin/registrations/courses',
      },
      {
        label: 'Instructors',
        href: '/admin/registrations/instructors',
      },
    ],
  },
  {
    label: 'Additional Enrollments',
    icon: BookOpen,
    href: '/admin/enrollments',
  },
  {
    label: 'Programs',
    icon: Code2,
    href: '/admin/programs',
  },
  {
    label: 'Classes',
    icon: Users2,
    href: '/admin/classes',
  },
  {
    label: 'Create Classes',
    icon: UserPlus,
    href: '/admin/create-class/students',
  },
  {
    label: 'Layouts',
    icon: IconTableOptions,
    href: '/admin/layouts/hero',
  },
];

const studentRoutes: SidebarItemProps[] = [
  { label: 'Dashboard', icon: Layout, href: '/student/dashboard' },
  { label: 'My Classes', icon: GraduationCap, href: '/classes' },
  { label: 'Enroll a New Course', icon: Code2, href: '/student/enrollments' },
  { label: 'Schedule', icon: CalendarDays, href: '/schedule' },
  { label: 'Profile', icon: User, href: '/profile' },
];

const instructorRoutes: SidebarItemProps[] = [
  { label: 'Dashboard', icon: Layout, href: '/instructor/dashboard' },
  { label: 'My Classes', icon: GraduationCap, href: '/classes' },
  { label: 'Schedule', icon: CalendarDays, href: '/schedule' },
  { label: 'Profile', icon: User, href: '/profile' },
];

const parentRoutes: SidebarItemProps[] = [
  { label: 'Dashboard', icon: Layout, href: '/parent/dashboard' },
  { label: 'Classes', icon: GraduationCap, href: '/classes' },
  { label: 'Schedule', icon: CalendarDays, href: '/schedule' },
  { label: 'Profile', icon: User, href: '/profile' },
];

const SidebarRoutes = ({ session }: { session: SessionInterface }) => {
  let routes: SidebarItemProps[] = [];

  switch (session.user.role) {
    case 'ADMIN':
      routes = adminRoutes;
      break;
    case 'STUDENT':
      routes = studentRoutes;
      break;
    case 'INSTRUCTOR':
      routes = instructorRoutes;
      break;
    case 'PARENT':
      routes = parentRoutes;
      break;
  }

  return (
    <div className='py-8'>
      {routes.map((item) => (
        <SidebarItem {...item} key={item.label} />
      ))}
    </div>
  );
};

export default SidebarRoutes;

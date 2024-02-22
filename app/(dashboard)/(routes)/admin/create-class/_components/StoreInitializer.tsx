'use client';

import { Course } from '@prisma/client';
import {
  InstructorSchedules,
  StudentCourses,
  useCreateClassStore,
} from '../_stores/use-create-class-store';
import { useRef } from 'react';

interface StoreInitializerProps {
  studentCourses: StudentCourses;
  instructorSchedules: InstructorSchedules;
  courses: Course[];
  mappedClassesCount: Record<string, number>;
}

export const StoreInitializer = ({
  instructorSchedules,
  studentCourses,
  courses,
  mappedClassesCount,
}: StoreInitializerProps) => {
  const initialized = useRef(false);

  const setStudentCourses = useCreateClassStore(
    (state) => state.setStudentCourses
  );

  const setInstructorSchedules = useCreateClassStore(
    (state) => state.setInstructorSchedules
  );

  const setCourses = useCreateClassStore((state) => state.setCourses);

  const setMappedClassesCount = useCreateClassStore(
    (state) => state.setMappedClassesCount
  );

  if (!initialized.current) {
    setStudentCourses(studentCourses);
    setInstructorSchedules(instructorSchedules);
    setCourses(courses);
    setMappedClassesCount(mappedClassesCount);
    initialized.current = true;
  }

  return null;
};

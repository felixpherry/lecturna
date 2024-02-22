import {
  Account,
  Course,
  Instructor,
  InstructorCourse,
  InstructorSchedule,
  MasterDay,
  MasterShift,
  Student,
  StudentCourse,
} from '@prisma/client';
import { create } from 'zustand';

export type StudentCourses = Array<
  {
    course: Course;
    student: {
      account: Account;
    } & Student;
  } & StudentCourse
>;

export type InstructorSchedules = Array<
  {
    day: MasterDay;
    shift: MasterShift;
    instructor: {
      account: Account;
      instructorCourses: Array<
        {
          course: Course;
        } & InstructorCourse
      >;
    } & Instructor;
  } & InstructorSchedule
>;

export type MappedClass = {
  id: string;
  name: string;
  courseId: string;
  studentCourseIds: string[];
  instructorScheduleId: string;
};

interface CreateClassStore {
  studentCourses: StudentCourses;
  setStudentCourses: (studentCourses: StudentCourses) => void;
  instructorSchedules: InstructorSchedules;
  setInstructorSchedules: (instructorSchedules: InstructorSchedules) => void;
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  mappedClasses: MappedClass[];
  setMappedClasses: (mappedClasses: MappedClass[]) => void;
  mappedClassesCount: Record<string, number>;
  setMappedClassesCount: (mappedClassesCount: Record<string, number>) => void;
}

export const useCreateClassStore = create<CreateClassStore>((set) => ({
  studentCourses: [],
  setStudentCourses: (studentCourses: StudentCourses) =>
    set(() => ({
      studentCourses,
    })),
  instructorSchedules: [],
  setInstructorSchedules: (instructorSchedules: InstructorSchedules) =>
    set(() => ({
      instructorSchedules,
    })),
  courses: [],
  setCourses: (courses: Course[]) =>
    set(() => ({
      courses,
    })),
  mappedClasses: [],
  setMappedClasses: (mappedClasses: MappedClass[]) =>
    set(() => ({
      mappedClasses,
    })),
  mappedClassesCount: {},
  setMappedClassesCount: (mappedClassesCount: Record<string, number>) =>
    set(() => ({
      mappedClassesCount,
    })),
}));

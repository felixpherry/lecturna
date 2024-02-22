import { db } from '@/lib/db';
import CourseCard from './CourseCard';
import CoursesPagination from './CoursesPagination';
import { Level } from '@prisma/client';

interface CoursesProps {
  searchParams: {
    search?: string;
    category?: string;
    level?: string;
    program?: string;
    page?: string;
  };
}

const Courses = async ({ searchParams }: CoursesProps) => {
  const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  const baseCourseQuery = {
    isPublished: true,
    isDeleted: false,
    program: {
      isPublished: true,
      isDeleted: false,
    },
    name: {
      contains: searchParams.search,
    },
    level: levels.includes(searchParams.level?.toLocaleUpperCase() || '')
      ? (searchParams.level?.toLocaleUpperCase() as Level)
      : undefined,
    categoryId: searchParams.category,
    programId: searchParams.program,
  };

  const [courses, count] = await Promise.all([
    db.course.findMany({
      where: baseCourseQuery,
      include: {
        category: {
          select: {
            ageDescription: true,
          },
        },
        _count: {
          select: {
            sessions: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: 12,
      skip: ((Number(searchParams.page) || 1) - 1) * 12,
    }),
    db.course.count({
      where: baseCourseQuery,
    }),
  ]);

  const hasNextPage = (Number(searchParams.page) || 1) * 12 < count;

  return (
    <>
      {!courses.length && (
        <p className='font-semibold text-xl text-center'>
          Kursus tidak dapat ditemukan
        </p>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      <CoursesPagination hasNextPage={hasNextPage} />
    </>
  );
};

export default Courses;

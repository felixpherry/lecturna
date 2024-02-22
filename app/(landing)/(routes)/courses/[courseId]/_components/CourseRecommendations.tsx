import { db } from '@/lib/db';
import CourseCard from '../../_components/CourseCard';
import Link from 'next/link';

interface CourseRecommendationsProps {
  courseId: string;
  programId: string;
}

const CourseRecommendations = async ({
  courseId,
  programId,
}: CourseRecommendationsProps) => {
  const courses = await db.course.findMany({
    where: {
      programId,
      id: {
        not: courseId,
      },
      isPublished: true,
      isDeleted: false,
    },
    orderBy: {
      name: 'asc',
    },
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
    take: 3,
  });

  if (!courses.length) return null;

  return (
    <div className='mt-10 lg:px-10'>
      <div className='flex justify-between items-center'>
        <h3 className='text-3xl font-semibold'>Kursus Lainnya</h3>
        <Link href='/courses' className='hover:underline text-primary-blue'>
          Lihat Semua
        </Link>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8'>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseRecommendations;

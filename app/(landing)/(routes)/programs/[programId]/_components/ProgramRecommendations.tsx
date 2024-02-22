import { db } from '@/lib/db';
import Link from 'next/link';
import ProgramCard from '@/app/(landing)/_components/ProgramCard';

interface ProgramRecommendationsProps {
  programId: string;
}

const ProgramRecommendations = async ({
  programId,
}: ProgramRecommendationsProps) => {
  const programs = await db.program.findMany({
    where: {
      id: {
        not: programId,
      },
      isPublished: true,
      isDeleted: false,
    },
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: {
          courses: {
            where: {
              isPublished: true,
              isDeleted: false,
            },
          },
        },
      },
    },
    take: 3,
  });

  if (!programs.length) return null;
  return (
    <div className='mt-10 lg:px-10'>
      <div className='flex justify-between items-center'>
        <h3 className='text-3xl font-semibold'>Program Lainnya</h3>
        <Link href='/' className='hover:underline text-primary-blue'>
          Lihat Semua
        </Link>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8'>
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  );
};

export default ProgramRecommendations;

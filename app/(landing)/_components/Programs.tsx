import { fetchCategories } from '@/lib/actions/category.actions';
import { Program } from '@prisma/client';
import ProgramCard from './ProgramCard';
import ProgramsFilter from './ProgramsFilter';

interface ProgramsProps {
  programs: ({
    _count: {
      courses: number;
    };
  } & Program)[];
}

const Programs = async ({ programs }: ProgramsProps) => {
  const categories = await fetchCategories();

  return (
    <div className='container max-w-7xl my-28'>
      <div className='text-center'>
        <h3 className='text-4xl font-bold'>Jelajahi Katalog Program Kami</h3>
        <p className='text-lg mt-3 text-slate-700'>
          Temukan dunia pembelajaran yang tak terhingga
        </p>
      </div>
      <div className='my-10'>
        <ProgramsFilter categories={categories} />
      </div>
      {!programs.length && (
        <p className='font-semibold text-xl text-center'>
          Program tidak dapat ditemukan
        </p>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  );
};

export default Programs;

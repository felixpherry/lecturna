import { fetchHero } from '@/lib/actions/hero.actions';
import HeroForm from './_components/HeroForm';

const Page = async () => {
  const hero = await fetchHero();
  return (
    <div className='p-5 shadow rounded-md bg-white'>
      <div className='flex flex-col gap-5'>
        <div className='pb-[15px] border-b'>
          <h3 className='text-muted-foreground font-bold text-base'>
            Customize Hero
          </h3>
        </div>
        <HeroForm initialData={hero} />
      </div>
    </div>
  );
};

export default Page;

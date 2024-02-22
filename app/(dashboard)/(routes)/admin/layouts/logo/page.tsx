import { fetchLogo } from '@/lib/actions/logo.actions';
import LogoForm from './_components/LogoForm';

const Page = async () => {
  const logo = await fetchLogo();
  return (
    <div className='p-5 shadow rounded-md bg-white'>
      <div className='flex flex-col gap-5'>
        <div className='pb-[15px] border-b'>
          <h3 className='text-muted-foreground font-bold text-base'>
            Customize Logo
          </h3>
        </div>
        <LogoForm initialData={logo} />
      </div>
    </div>
  );
};

export default Page;

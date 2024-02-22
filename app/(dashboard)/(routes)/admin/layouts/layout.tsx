import LayoutTabs from './_components/LayoutTabs';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col gap-5'>
      <h1 className='text-lg text-muted-foreground font-bold'>
        Layout Settings
      </h1>
      <div className='flex flex-col md:flex-row md:items-start gap-5'>
        <LayoutTabs />
        <div className='w-full md:w-[calc(100%-208px)]'>{children}</div>
      </div>
    </div>
  );
};

export default Layout;

import RegistrationTabs from './_components/RegistrationTabs';
import { db } from '@/lib/db';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const trialClassCount = await db.trialClassRegistration.count({
    where: {
      status: 'PENDING',
    },
  });

  const courseRegistrationCount = await db.courseRegistration.count({
    where: {
      status: 'PENDING',
    },
  });

  const instructorRegistrationCount = await db.instructorRegistration.count({
    where: {
      status: 'PENDING',
    },
  });

  return (
    <>
      <RegistrationTabs
        courseRegistrationCount={courseRegistrationCount}
        instructorRegistrationCount={instructorRegistrationCount}
        trialClassCount={trialClassCount}
      />
      <div className='bg-white rounded-b-lg shadow-sm'>{children}</div>
    </>
  );
};

export default Layout;

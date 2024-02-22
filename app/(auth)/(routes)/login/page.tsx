import UserAuthForm from '@/components/forms/UserAuthForm';
import { Button } from '@/components/ui/button';
import { fetchLogo } from '@/lib/actions/logo.actions';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import { ChevronLeft } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ErrorNotification from './_components/ErrorNotification';

interface LoginPageProps {
  searchParams: {
    error?: string;
  };
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;
  const logo = await fetchLogo();

  if (session) redirect('/dashboard');
  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      {searchParams.error && <ErrorNotification error={searchParams.error} />}
      <Link href='/' className='absolute left-4 top-4 md:left-8 md:top-8'>
        <Button variant='ghost'>
          <ChevronLeft className='h-4 w-4 mr-2' /> Kembali
        </Button>
      </Link>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col space-y-2 text-center'>
          <Image
            src={logo?.image || '/logo.png'}
            height={75}
            width={75}
            alt='logo'
            className='mx-auto'
          />
          <h1 className='text-2xl font-semibold tracking-tight'>
            Selamat datang di Lecturna
          </h1>
          <p className='text-sm text-gray-100'>
            Masuk ke akun menggunakan email
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  );
};

export default LoginPage;

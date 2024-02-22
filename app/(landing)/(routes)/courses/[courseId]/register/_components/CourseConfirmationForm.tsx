'use client';

import * as z from 'zod';
import { studentInfoSchema } from './StudentInfoForm';
import { parentInfoSchema } from './ParentInfoForm';
import { Card, CardContent } from '@/components/ui/card';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { registerCourse } from '../_actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CourseConfirmationFormProps {
  currentStep: number;
  setCurrentStep: (newStep: number) => void;
  studentInfo: z.infer<typeof studentInfoSchema>;
  parentInfo: z.infer<typeof parentInfoSchema>;
  couponId: string;
  courseId: string;
}

const CourseConfirmationForm = ({
  currentStep,
  setCurrentStep,
  studentInfo,
  parentInfo,
  couponId,
  courseId,
}: CourseConfirmationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleStepBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const router = useRouter();

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      if (studentInfo.childEmail === parentInfo.parentEmail) {
        return toast.error(
          'Pendaftaran gagal. Alamat email orang tua dan anak tidak dapat sama. Harap pastikan alamat email keduanya berbeda untuk melanjutkan.'
        );
      }

      const { error, message } = await registerCourse({
        payload: {
          couponId,
          courseId,
          ...studentInfo,
          ...parentInfo,
        },
      });
      if (error !== null) throw new Error(message);
      toast.success(message);

      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className='text-3xl font-bold'>Konfirmasi</h2>
      <p className='text-muted-foreground'>
        Periksa kembali semua data sebelum mengonfirmasi
      </p>
      <div className='mt-10 p-8 shadow rounded-sm flex flex-col gap-12 md:gap-16'>
        <div className=''>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl font-semibold'>Data Calon Siswa</h3>
            <span
              onClick={() => setCurrentStep(1)}
              className='text-blue-500 hover:text-primary-blue cursor-pointer hover:underline font-medium'
            >
              Ganti
            </span>
          </div>
          <div className='border-b border-slate-300 my-5'></div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <span className='text-muted-foreground'>Nama Anak</span>
              <span>{studentInfo.childName}</span>
            </div>
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <span className='text-muted-foreground'>Email Anak</span>
              <span>{studentInfo.childEmail}</span>
            </div>
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <span className='text-muted-foreground'>Jenis Kelamin</span>
              <span>
                {studentInfo.childGender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
              </span>
            </div>
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <span className='text-muted-foreground'>
                Tempat, Tanggal Lahir
              </span>
              <span>
                {studentInfo.birthPlace},{' '}
                {moment(studentInfo.dateOfBirth).format('DD MMMM YYYY')}
              </span>
            </div>
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <span className='text-muted-foreground'>Kelas</span>
              <span>{studentInfo.gradeClass}</span>
            </div>
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <span className='text-muted-foreground'>Asal Sekolah</span>
              <span>{studentInfo.educationInstitution}</span>
            </div>
          </div>
        </div>
        <div className=''>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl font-semibold'>Data Orang Tua</h3>
            <span
              onClick={() => setCurrentStep(2)}
              className='text-blue-500 hover:text-primary-blue cursor-pointer hover:underline font-medium'
            >
              Ganti
            </span>
          </div>
          <div className='border-b border-slate-300 my-5'></div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <span className='text-muted-foreground'>Nama Orang Tua</span>
              <span>{parentInfo.parentName}</span>
            </div>
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <span className='text-muted-foreground'>Email</span>
              <span>{parentInfo.parentEmail}</span>
            </div>
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <span className='text-muted-foreground'>No. HP</span>
              <span>{parentInfo.phoneNumber}</span>
            </div>
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <span className='text-muted-foreground'>Alamat</span>
              <span>{parentInfo.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-5 mt-10'>
        <div className='flex justify-between'>
          <Button type='button' variant='outline' onClick={handleStepBack}>
            Kembali
          </Button>
          <Button onClick={onSubmit} disabled={isLoading} type='submit'>
            {isLoading ? (
              <Loader2 className='animate-spin h-4 w-4' />
            ) : (
              <CheckCircle2 className='h-4 w-4' />
            )}
            Konfirmasi
          </Button>
        </div>
      </div>
    </>
  );
};

export default CourseConfirmationForm;

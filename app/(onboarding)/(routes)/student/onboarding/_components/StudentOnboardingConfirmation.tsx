'use client';

import moment from 'moment';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn, convertToTitleCase } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { useRouter } from 'next/navigation';
import { useStudentOnboardingStore } from '../_stores/use-student-onboarding-store';
import { handleStudentOnboarding } from '../_actions';

const StudentOnboardingConfirmation = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startUpload: uploadProfilePhoto } = useUploadThing('profilePhoto');

  const router = useRouter();

  const { accountDetail, setActive, personalInfo, profilePhoto, stepBack } =
    useStudentOnboardingStore();

  const { email, password, username, image } = accountDetail;

  const mappedAccountDetails = [
    {
      label: 'Username',
      value: username,
    },
    {
      label: 'Email',
      value: email,
    },
  ];

  const {
    ambition,
    birthPlace,
    gender,
    gradeClass,
    hobby,
    address,
    dateOfBirth,
    educationInstitution,
    name,
    phoneNumber,
  } = personalInfo;

  const mappedPersonalInfo = [
    {
      label: 'Name',
      value: name,
    },
    {
      label: 'Gender',
      value: convertToTitleCase(gender || ''),
    },
    {
      label: 'Phone Number',
      value: phoneNumber,
    },
    {
      label: 'Birth Place',
      value: birthPlace,
    },
    {
      label: 'Date of Birth',
      value: moment(dateOfBirth).format('DD-MM-YYYY'),
    },
    {
      label: 'Grade Class',
      value: gradeClass,
    },
    {
      label: 'Education Institution',
      value: educationInstitution,
    },
    {
      label: 'Address',
      value: address,
    },
    {
      label: 'Hobby',
      value: hobby,
    },
    {
      label: 'Ambition',
      value: ambition,
    },
  ];

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const profilePhotoRes = await uploadProfilePhoto(profilePhoto);

      if (!profilePhotoRes || !profilePhotoRes[0].url) {
        throw new Error('Failed to save profile photo');
      }

      await handleStudentOnboarding({
        accountDetail: {
          ...accountDetail,
          image: profilePhotoRes[0].url,
        },
        personalInfo,
      });

      toast.success('Successfully onboarded');

      router.push('/student/dashboard');
    } catch (error: any) {
      toast.error(`Failed to save data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col gap-5 mt-10'>
      <div className='flex flex-col gap-3 text-center'>
        <h3 className='text-primary text-3xl font-bold'>Confirmation</h3>
        <p className='font-semibold text-lg text-muted-foreground'>
          Double check all data before confirming
        </p>
      </div>
      <div className='mt-10 p-8 shadow rounded-sm grid grid-cols-1 gap-12 md:gap-16'>
        <div className=''>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl font-semibold'>Account Detail</h3>
            <span
              onClick={() => setActive(0)}
              className='text-blue-500 hover:text-primary-blue cursor-pointer hover:underline font-medium'
            >
              Edit
            </span>
          </div>
          <div className='border-b border-slate-300 my-5'></div>
          <div className='flex flex-col gap-2'>
            <Image
              src={image || ''}
              height={96}
              width={96}
              alt='Profile Photo'
              className='rounded-full h-24 w-24'
            />
            {mappedAccountDetails.map(({ label, value }) => (
              <div
                key={label}
                className='flex flex-col md:flex-row justify-between text-primary font-semibold'
              >
                <span className='text-muted-foreground'>{label}</span>
                <span>{value}</span>
              </div>
            ))}
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <span className='text-muted-foreground'>Password</span>
              <div className='flex items-center gap-3'>
                <p>{showPassword ? password : '*'.repeat(password.length)}</p>
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className='cursor-pointer'
                >
                  {showPassword ? (
                    <Eye className='h-4 w-4' />
                  ) : (
                    <EyeOff className='h-4 w-4' />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className=''>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl font-semibold'>Personal Info</h3>
            <span
              onClick={() => setActive(1)}
              className='text-blue-500 hover:text-primary-blue cursor-pointer hover:underline font-medium'
            >
              Edit
            </span>
          </div>
          <div className='border-b border-slate-300 my-5'></div>
          <div className='flex flex-col gap-2'>
            {mappedPersonalInfo.map(({ label, value }) => (
              <div
                key={label}
                className='flex flex-col md:flex-row justify-between text-primary font-semibold'
              >
                <span className='text-muted-foreground'>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='!mt-5 flex justify-between'>
        <Button type='button' variant='outline' onClick={stepBack}>
          Back
        </Button>
        <Button onClick={onSubmit}>
          {isSubmitting && <Loader2 className='animate-spin mr-2 h-4 w-4' />}
          Save
        </Button>
      </div>
    </div>
  );
};

export default StudentOnboardingConfirmation;

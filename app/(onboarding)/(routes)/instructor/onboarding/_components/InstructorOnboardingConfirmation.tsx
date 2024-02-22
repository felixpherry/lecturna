'use client';

import { Course, MasterDay, MasterShift, Skill } from '@prisma/client';
import { AccountDetail } from './InstructorAccountDetailForm';
import { InstructorSchedule } from './InstructorOnboardingStepper';
import { InstructorPersonalInfo } from './InstructorPersonalInfoForm';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { CalendarDays, Code2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn, convertToTitleCase } from '@/lib/utils';
import { List, ThemeIcon } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { useUploadThing } from '@/lib/uploadthing';
import { handleInstructorOnboarding } from '../_actions';
import { useRouter } from 'next/navigation';

interface InstructorOnboardingConfirmationProps {
  setActive: (active: number) => void;
  accountDetail: AccountDetail;
  setAccountDetail: (v: AccountDetail) => void;
  instructorPersonalInfo: InstructorPersonalInfo;
  setInstructorPersonalInfo: (v: InstructorPersonalInfo) => void;
  instructorCourses: string[];
  instructorSchedules: InstructorSchedule[];
  days: MasterDay[];
  shifts: MasterShift[];
  courses: Course[];
  skills: Skill[];
  fileIDCard: File[];
  fileNPWP: File[];
  profilePhoto: File[];
}

const InstructorOnboardingConfirmation = ({
  accountDetail,
  courses,
  days,
  instructorCourses,
  instructorPersonalInfo,
  instructorSchedules,
  setActive,
  shifts,
  skills,
  profilePhoto,
  fileIDCard,
  fileNPWP,
}: InstructorOnboardingConfirmationProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { startUpload: uploadIDCard } = useUploadThing('fileIDCard');
  const { startUpload: uploadNPWP } = useUploadThing('fileNPWP');
  const { startUpload: uploadProfilePhoto } = useUploadThing('profilePhoto');

  const router = useRouter();

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
    address,
    dateOfBirth,
    educationInstitution,
    lastEducation,
    name,
    phoneNumber,
    skills: instructorSkills,
    fileIDCard: base64FileIDCard,
    fileNPWP: base64FileNPWP,
  } = instructorPersonalInfo;

  const mappedPersonalInfo = [
    {
      label: 'Name',
      value: name,
    },
    {
      label: 'Phone Number',
      value: phoneNumber,
    },
    {
      label: 'Address',
      value: address,
    },
    {
      label: 'Date of Birth',
      value: moment(dateOfBirth).format('DD-MM-YYYY'),
    },
    {
      label: 'Last Education',
      value: lastEducation,
    },
    {
      label: 'Education Institution',
      value: educationInstitution,
    },
  ];

  const handleStepBack = () => {
    setActive(2);
  };

  const getSkill = (skillId: string) => {
    const skill = skills.find(({ id }) => skillId === id);

    return skill?.name || '';
  };

  const getDay = (dayId: string) => {
    const res = days.find(({ id }) => dayId === id);

    return convertToTitleCase(res?.day || '');
  };

  const getShift = (shiftId: string) => {
    const res = shifts.find(({ id }) => shiftId === id);

    return `${res?.startTime || ''} - ${res?.endTime || ''}`;
  };

  const getCourse = (courseId: string) => {
    const res = courses.find(({ id }) => courseId === id);

    return res?.name || '';
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const profilePhotoRes = await uploadProfilePhoto(profilePhoto);

      if (!profilePhotoRes || !profilePhotoRes[0].url) {
        throw new Error('Failed to save profile photo');
      }

      const fileIDCardRes = await uploadIDCard(fileIDCard);

      if (!fileIDCardRes || !fileIDCardRes[0].url) {
        throw new Error('Failed to save ID Card');
      }

      const fileNPWPRes = await uploadNPWP(fileNPWP);

      if (!fileNPWPRes || !fileNPWPRes[0].url) {
        throw new Error('Failed to save NPWP');
      }

      await handleInstructorOnboarding({
        accountDetail: {
          ...accountDetail,
          image: profilePhotoRes[0].url,
        },
        instructorCourses,
        instructorPersonalInfo: {
          ...instructorPersonalInfo,
          fileIDCard: fileIDCardRes[0].url,
          fileNPWP: fileNPWPRes[0].url,
        },
        instructorSchedules,
      });

      toast.success('Successfully onboarded');

      router.push('/instructor/dashboard');
    } catch (error: any) {
      toast.error(`Failed to save data: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mappedInstructorSchedules = instructorSchedules.reduce(
    (curr, { dayId, shiftId }) => {
      if (curr[dayId] === undefined) curr[dayId] = [shiftId];
      else curr[dayId].push(shiftId);
      return curr;
    },
    {} as Record<string, string[]>
  );

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
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <p className='text-muted-foreground font-semibold'>ID Card</p>
              <Image
                src={base64FileIDCard || ''}
                width={150}
                height={150}
                className='h-40 w-fit'
                alt='ID Card'
              />
            </div>
            <div className='flex flex-col md:flex-row justify-between text-primary font-semibold'>
              <p className='text-muted-foreground font-semibold'>NPWP</p>
              <Image
                src={base64FileNPWP || ''}
                width={150}
                height={150}
                className='h-40 w-fit'
                alt='NPWP'
              />
            </div>
            <p className='text-muted-foreground font-semibold'>Skills</p>
            <div className='flex flex-wrap gap-3 items-center'>
              {instructorSkills.map((skillId) => (
                <Badge key={skillId} className='px-3 py-[6px]'>
                  {getSkill(skillId)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className=''>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl font-semibold'>Course & Schedule</h3>
            <span
              onClick={() => setActive(2)}
              className='text-blue-500 hover:text-primary-blue cursor-pointer hover:underline font-medium'
            >
              Edit
            </span>
          </div>
          <div className='border-b border-slate-300 my-5'></div>
          <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-3'>
              <Code2 />
              <p className='text-primary text-lg font-semibold'>Courses</p>
            </div>
            <div className='flex gap-3'>
              <List
                spacing='xs'
                size='sm'
                center
                icon={
                  <ThemeIcon color='teal' size={24} radius='xl'>
                    <IconCircleCheck size='1rem' />
                  </ThemeIcon>
                }
              >
                {instructorCourses.map((courseId) => (
                  <List.Item
                    key={courseId}
                    className='text-muted-foreground font-semibold text-lg'
                  >
                    {getCourse(courseId)}
                  </List.Item>
                ))}
              </List>
            </div>
            <div className='flex items-center gap-3'>
              <CalendarDays />
              <p className='text-primary text-lg font-semibold'>Schedules</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5'>
              {Object.keys(mappedInstructorSchedules).map((dayId, idx) => {
                return (
                  <>
                    <div
                      key={dayId}
                      className='flex flex-col text-center shadow-lg rounded-lg'
                    >
                      <p
                        className={cn(
                          'font-bold text-muted-foreground py-5 rounded-t-lg text-white',
                          idx % 2 === 0
                            ? 'bg-primary-blue'
                            : 'bg-primary-yellow'
                        )}
                      >
                        {getDay(dayId)}
                      </p>
                      <div
                        className={cn(
                          'flex flex-col gap-3 px-8 pb-5 h-full pt-3',
                          idx % 2 === 0 ? 'bg-[#e9f0ff]' : 'bg-[#fff8e1]'
                        )}
                      >
                        {mappedInstructorSchedules[dayId].map(
                          (shiftId, idx) => (
                            <>
                              <p
                                className='font-medium px-8'
                                key={`${dayId} - ${shiftId}`}
                              >
                                {getShift(shiftId)}
                              </p>
                              {idx <
                                mappedInstructorSchedules[dayId].length - 1 && (
                                <hr className='bg-primary' />
                              )}
                            </>
                          )
                        )}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className='!mt-5 flex justify-between'>
        <Button type='button' variant='outline' onClick={handleStepBack}>
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

export default InstructorOnboardingConfirmation;

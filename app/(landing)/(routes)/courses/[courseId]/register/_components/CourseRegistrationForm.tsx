'use client';

import * as z from 'zod';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import StudentInfoForm, { studentInfoSchema } from './StudentInfoForm';
import ParentInfoForm, { parentInfoSchema } from './ParentInfoForm';
import CourseFormStepper from './CourseFormStepper';
import CourseConfirmationForm from './CourseConfirmationForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CouponForm from './CouponForm';

const steps = ['Data Calon Siswa', 'Data Orang Tua', 'Konfirmasi'];

const CourseRegistrationForm = ({ courseId }: { courseId: string }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [studentInfo, setStudentInfo] = useState<
    z.infer<typeof studentInfoSchema>
  >({
    childName: '',
    childEmail: '',
    birthPlace: '',
    dateOfBirth: new Date(),
    childGender: 'MALE',
    educationInstitution: '',
    gradeClass: '',
  });

  const [parentInfo, setParentInfo] = useState<
    z.infer<typeof parentInfoSchema>
  >({
    address: '',
    parentEmail: '',
    parentName: '',
    phoneNumber: '',
  });

  const [coupon, setCoupon] = useState({
    id: '',
    code: '',
  });

  return (
    <div className='container max-w-7xl py-28'>
      <div className='flex gap-10 flex-col md:flex-row'>
        <div className='w-full md:w-[330px] flex flex-col gap-5'>
          <CourseFormStepper currentStep={currentStep} steps={steps} />
          <CouponForm coupon={coupon} setCoupon={setCoupon} />
        </div>
        <div className='w-full md:w-2/3 p-4'>
          {currentStep === 1 && (
            <StudentInfoForm
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              initialStudentInfo={studentInfo}
              setStudentInfo={setStudentInfo}
            />
          )}{' '}
          {currentStep === 2 && (
            <ParentInfoForm
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              initialParentInfo={parentInfo}
              setParentInfo={setParentInfo}
            />
          )}
          {currentStep === 3 && (
            <CourseConfirmationForm
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              studentInfo={studentInfo}
              parentInfo={parentInfo}
              couponId={coupon.id}
              courseId={courseId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseRegistrationForm;

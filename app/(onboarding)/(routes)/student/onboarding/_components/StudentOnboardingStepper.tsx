'use client';

import { useEffect, useState } from 'react';
import { Stepper } from '@mantine/core';
import { Account, Student } from '@prisma/client';
import { useStudentOnboardingStore } from '../_stores/use-student-onboarding-store';
import StudentAccountDetailForm from './StudentAccountDetailForm';
import StudentPersonalInfoForm from './StudentPersonalInfoForm';
import StudentOnboardingConfirmation from './StudentOnboardingConfirmation';

const StudentOnboardingStepper = () => {
  const active = useStudentOnboardingStore((state) => state.active);
  const setActive = useStudentOnboardingStore((state) => state.setActive);

  return (
    <div>
      <div className='flex flex-col gap-3 justify-center items-center p-10'>
        <h3 className='font-bold text-4xl'>Welcome to Lecturna</h3>
        <p className='font-lg text-muted-foreground'>
          Please provide your essential details to get started with the app.
        </p>
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
          className='mt-10 w-full'
        >
          <Stepper.Step label='Step 1' description='Account Detail'>
            <StudentAccountDetailForm />
          </Stepper.Step>
          <Stepper.Step label='Step 2' description='Personal Info'>
            <StudentPersonalInfoForm />
          </Stepper.Step>
          <Stepper.Step label='Step 3' description='Confirmation'>
            <StudentOnboardingConfirmation />
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
      </div>
    </div>
  );
};

export default StudentOnboardingStepper;

'use client';

import { useState } from 'react';
import { Stepper } from '@mantine/core';
import InstructorAccountDetailForm from './InstructorAccountDetailForm';
import {
  Account,
  Course,
  Instructor,
  MasterDay,
  MasterShift,
  Skill,
} from '@prisma/client';
import InstructorPersonalInfoForm from './InstructorPersonalInfoForm';
import InstructorCourseScheduleForm from './InstructorCourseScheduleForm';
import InstructorOnboardingConfirmation from './InstructorOnboardingConfirmation';

interface InstructorOnboardingStepperProps {
  data: {
    instructor: {
      skills: {
        id: string;
      }[];
    } & Instructor;
  } & Account;
  skills: Skill[];
  days: MasterDay[];
  shifts: MasterShift[];
  courses: Course[];
}

export interface InstructorSchedule {
  dayId: string;
  shiftId: string;
}

const InstructorOnboardingStepper = ({
  data,
  skills,
  days,
  shifts,
  courses,
}: InstructorOnboardingStepperProps) => {
  const [active, setActive] = useState(0);

  const { email, address, image, instructor, name, phoneNumber, username } =
    data;

  const {
    dateOfBirth,
    educationInstitution,
    lastEducation,
    skills: instructorSkills,
  } = instructor;

  const [accountDetail, setAccountDetail] = useState({
    username,
    email,
    password: '',
    confirmPassword: '',
    image,
  });

  const [instructorPersonalInfo, setInstructorPersonalInfo] = useState({
    name,
    phoneNumber,
    address,
    dateOfBirth,
    lastEducation,
    educationInstitution,
    skills: instructorSkills.map(({ id }) => id),
    fileIDCard: '',
    fileNPWP: '',
  });

  const [instructorCourses, setInstructorCourses] = useState<string[]>([]);
  const [instructorSchedules, setInstructorSchedules] = useState<
    InstructorSchedule[]
  >([]);

  const [profilePhoto, setProfilePhoto] = useState<File[]>([]);
  const [fileIDCard, setFileIDCard] = useState<File[]>([]);
  const [fileNPWP, setFileNPWP] = useState<File[]>([]);

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
          className='mt-10'
        >
          <Stepper.Step label='Step 1' description='Account Detail'>
            <InstructorAccountDetailForm
              setActive={setActive}
              accountDetail={accountDetail}
              setAccountDetail={setAccountDetail}
              profilePhoto={profilePhoto}
              setProfilePhoto={setProfilePhoto}
            />
          </Stepper.Step>
          <Stepper.Step label='Step 2' description='Personal Info'>
            <InstructorPersonalInfoForm
              instructorPersonalInfo={instructorPersonalInfo}
              setActive={setActive}
              skills={skills}
              setInstructorPersonalInfo={setInstructorPersonalInfo}
              fileIDCard={fileIDCard}
              setFileIDCard={setFileIDCard}
              fileNPWP={fileNPWP}
              setFileNPWP={setFileNPWP}
            />
          </Stepper.Step>
          <Stepper.Step label='Step 3' description='Course & Schedule'>
            <InstructorCourseScheduleForm
              days={days}
              shifts={shifts}
              courses={courses}
              instructorCourses={instructorCourses}
              setInstructorCourses={setInstructorCourses}
              instructorSchedules={instructorSchedules}
              setInstructorSchedules={setInstructorSchedules}
              setActive={setActive}
            />
          </Stepper.Step>
          <Stepper.Step label='Step 4' description='Confirmation'>
            <InstructorOnboardingConfirmation
              setActive={setActive}
              accountDetail={accountDetail}
              setAccountDetail={setAccountDetail}
              instructorPersonalInfo={instructorPersonalInfo}
              setInstructorPersonalInfo={setInstructorPersonalInfo}
              instructorCourses={instructorCourses}
              instructorSchedules={instructorSchedules}
              days={days}
              shifts={shifts}
              courses={courses}
              skills={skills}
              profilePhoto={profilePhoto}
              fileIDCard={fileIDCard}
              fileNPWP={fileNPWP}
            />
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
      </div>
    </div>
  );
};

export default InstructorOnboardingStepper;

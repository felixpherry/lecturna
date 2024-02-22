'use client';

import { Account, Student } from '@prisma/client';
import { useRef } from 'react';
import { useStudentOnboardingStore } from '../_stores/use-student-onboarding-store';

interface StoreInitializerProps {
  data: {
    student: Student;
  } & Account;
}

const StoreInitializer = ({ data }: StoreInitializerProps) => {
  const { address, email, id, image, name, password, phoneNumber, student } =
    data;

  const {
    ambition,
    birthPlace,
    dateOfBirth,
    educationInstitution,
    gender,
    gradeClass,
    hobby,
  } = student;
  const initialized = useRef(false);

  const setAccountDetail = useStudentOnboardingStore(
    (state) => state.setAccountDetail
  );

  const setPersonalInfo = useStudentOnboardingStore(
    (state) => state.setPersonalInfo
  );

  if (!initialized.current) {
    setAccountDetail({
      username: '',
      confirmPassword: '',
      email,
      image: '',
      password: '',
    });

    setPersonalInfo({
      address: address || '',
      ambition: ambition || '',
      birthPlace,
      dateOfBirth,
      educationInstitution: educationInstitution || '',
      gradeClass: gradeClass || '',
      hobby: hobby || '',
      name,
      phoneNumber: phoneNumber || '',
      gender,
    });

    initialized.current = true;
  }
  return null;
};

export default StoreInitializer;

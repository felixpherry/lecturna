import { Gender } from '@prisma/client';
import { create } from 'zustand';

export interface StudentAccountDetail {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  image: string;
}

export interface StudentPersonalInfo {
  name: string;
  gender: Gender | null;
  phoneNumber: string;
  address: string;
  dateOfBirth: Date;
  birthPlace: string;
  gradeClass: string;
  educationInstitution: string;
  hobby: string;
  ambition: string;
}

interface StudentOnboardingStore {
  active: number;
  setActive: (newActive: number) => void;
  stepBack: () => void;
  stepForward: () => void;
  accountDetail: StudentAccountDetail;
  setAccountDetail: (newAccountDetail: StudentAccountDetail) => void;
  profilePhoto: File[];
  setProfilePhoto: (file: File[]) => void;
  personalInfo: StudentPersonalInfo;
  setPersonalInfo: (newPersonalInfo: StudentPersonalInfo) => void;
}

export const useStudentOnboardingStore = create<StudentOnboardingStore>(
  (set) => ({
    active: 0,
    setActive: (newActive: number) => set(() => ({ active: newActive })),
    stepBack: () => set((state) => ({ active: Math.max(state.active - 1, 0) })),
    stepForward: () =>
      set((state) => ({ active: Math.min(state.active + 1, 3) })),
    accountDetail: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      image: '',
    },
    setAccountDetail: (newAccountDetail: StudentAccountDetail) =>
      set(() => ({
        accountDetail: { ...newAccountDetail },
      })),
    profilePhoto: [],
    setProfilePhoto: (file: File[]) => set(() => ({ profilePhoto: file })),
    personalInfo: {
      name: '',
      gender: null,
      phoneNumber: '',
      address: '',
      dateOfBirth: new Date(),
      birthPlace: '',
      gradeClass: '',
      educationInstitution: '',
      hobby: '',
      ambition: '',
    },
    setPersonalInfo: (newPersonalInfo: StudentPersonalInfo) =>
      set(() => ({
        personalInfo: { ...newPersonalInfo },
      })),
  })
);

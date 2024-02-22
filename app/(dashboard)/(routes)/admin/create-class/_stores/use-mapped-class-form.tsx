import { create } from 'zustand';

export type MappedClassFormType = 'ADD' | 'EDIT' | 'VIEW';

interface MappedClassForm {
  formType: MappedClassFormType;
  setFormType: (formType: MappedClassFormType) => void;
}

export const useMappedClassForm = create<MappedClassForm>((set) => ({
  formType: 'ADD',
  setFormType: (formType: MappedClassFormType) => set(() => ({ formType })),
}));

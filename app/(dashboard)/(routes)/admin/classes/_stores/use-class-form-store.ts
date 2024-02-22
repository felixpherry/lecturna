import { create } from 'zustand';

type FormType = 'EDIT' | 'VIEW';

interface ClassFormStore {
  formType: FormType;
  setFormType: (formType: FormType) => void;
}

export const useClassFormStore = create<ClassFormStore>((set) => ({
  formType: 'VIEW',
  setFormType: (formType: FormType) => set({ formType }),
}));

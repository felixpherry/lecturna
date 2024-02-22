'use client';

import {
  GraduationCap,
  LockKeyhole,
  LucideIcon,
  Presentation,
  UserCog,
} from 'lucide-react';
import { useState } from 'react';
import AccountDetailsForm from './AccountDetailsForm';
import ChangePasswordForm from './ChangePasswordForm';
import StudentInformationForm from './StudentInformationForm';
import { cn } from '@/lib/utils';
import { AccountWithRoleDetails } from '@/types';
import InstructorInformationForm from './InstructorInformationForm';

interface ProfileSettingsTabsProps {
  account: AccountWithRoleDetails;
}

interface Tab {
  label: string;
  icon: LucideIcon;
  content: JSX.Element;
}

const ProfileSettingsTabs = ({ account }: ProfileSettingsTabsProps) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const tabs = [
    {
      label: 'Account Details',
      icon: UserCog,
      content: <AccountDetailsForm initialData={account} />,
    },
    {
      label: 'Change Password',
      icon: LockKeyhole,
      content: <ChangePasswordForm accountId={account.id} />,
    },
    account.student !== null && {
      label: 'Student Information',
      icon: GraduationCap,
      content: <StudentInformationForm initialData={account.student} />,
    },
    account.instructor !== null && {
      label: 'Instructor Information',
      icon: Presentation,
      content: <InstructorInformationForm initialData={account.instructor} />,
    },
  ].filter(Boolean) as Tab[];

  return (
    <div className='flex flex-col md:flex-row md:items-start gap-5'>
      <div className='p-5 min-w-[208px] bg-white rounded-md shadow flex flex-col'>
        {tabs.map(({ icon: Icon, label }, idx) => (
          <button
            onClick={() => setSelectedIdx(idx)}
            key={label}
            className={cn(
              'flex items-center gap-2 p-3 rounded-md cursor-pointer',
              selectedIdx === idx
                ? 'bg-primary-blue text-white'
                : 'text-muted-foreground hover:bg-sky-200/20'
            )}>
            <Icon className='w-4 h-4' />
            {label}
          </button>
        ))}
      </div>
      <div className='p-5 bg-white rounded-md shadow flex-1'>
        <h3 className='pb-3 border-b text-lg font-bold text-primary'>
          {tabs[selectedIdx].label}
        </h3>
        {tabs[selectedIdx].content}
      </div>
    </div>
  );
};

export default ProfileSettingsTabs;

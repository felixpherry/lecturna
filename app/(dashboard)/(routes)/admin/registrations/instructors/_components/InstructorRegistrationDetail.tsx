'use client';

import ActionTooltip from '@/components/shared/ActionTooltip';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { InstructorRegistration } from '@prisma/client';
import { Eye } from 'lucide-react';
import moment from 'moment';

interface InstructorRegistrationDetailProps {
  data: {
    skills: {
      id: string;
      name: string;
    }[];
  } & InstructorRegistration;
}

const InstructorRegistrationDetail = ({
  data,
}: InstructorRegistrationDetailProps) => {
  const {
    address,
    dateOfBirth,
    educationInstitution,
    email,
    lastEducation,
    id,
    name,
    phoneNumber,
    skills,
    status,
    createdAt,
  } = data;

  const rows = [
    {
      key: 'ID',
      value: id,
    },
    {
      key: 'Date of Birth',
      value: moment(dateOfBirth).format('DD-MM-YYYY'),
    },
    {
      key: 'Last Education',
      value: lastEducation,
    },
    {
      key: 'Education Institution',
      value: educationInstitution,
    },
    {
      key: 'Email',
      value: email,
    },
    {
      key: 'Phone Number',
      value: phoneNumber,
    },
    {
      key: 'Address',
      value: address,
    },
    {
      key: 'Registration Date',
      value: moment(createdAt).format('DD-MM-YYYY'),
    },
  ];

  const statusVariant = status.toLocaleLowerCase() as BadgeProps['variant'];
  return (
    <Dialog>
      <DialogTrigger>
        <ActionTooltip label='Details'>
          <Eye className='text-muted-foreground hover:text-primary' />
        </ActionTooltip>
      </DialogTrigger>
      <DialogContent className='p-8'>
        <DialogHeader>
          <DialogTitle>Instructor Registration Details</DialogTitle>
        </DialogHeader>
        <div className='flex gap-x-5 items-center my-3'>
          <h3 className='font-semibold text-xl'>{name}</h3>
          <Badge variant={statusVariant}>
            {status[0] + status.substring(1).toLocaleLowerCase()}
          </Badge>
        </div>
        <div className='flex gap-3 flex-wrap'>
          {skills.map(({ id, name }) => (
            <Badge key={id} variant='sky-lighten'>
              {name}
            </Badge>
          ))}
        </div>
        <div className='flex flex-col gap-3'>
          {rows.map(({ key, value }) => (
            <div
              key={key}
              className='flex justify-between text-muted-foreground'
            >
              <span>{key}</span>
              <span className='text-primary font-semibold'>{value}</span>
            </div>
          ))}
        </div>
        <div className='flex justify-end gap-3 mt-3'>
          <DialogClose asChild>
            <Button variant='light' size='sm'>
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructorRegistrationDetail;

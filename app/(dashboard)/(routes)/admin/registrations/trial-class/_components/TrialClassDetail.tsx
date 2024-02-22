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
import { TrialClassRegistration } from '@prisma/client';
import { Eye } from 'lucide-react';
import moment from 'moment';

interface TrialClassDetailProps {
  data: {
    course: {
      name: string;
    };
  } & TrialClassRegistration;
}

const TrialClassDetail = ({ data }: TrialClassDetailProps) => {
  const {
    birthPlace,
    childName,
    status,
    trialClassDate,
    dateOfBirth,
    email,
    parentName,
    phoneNumber,
    createdAt,
    course,
    id,
  } = data;

  const rows = [
    {
      key: 'ID',
      value: id,
    },
    {
      key: 'Course',
      value: course.name,
    },
    {
      key: 'Birth Place',
      value: birthPlace,
    },
    {
      key: 'Date of Birth',
      value: moment(dateOfBirth).format('DD-MM-YYYY'),
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
      key: 'Parent Name',
      value: parentName,
    },
    {
      key: 'Trial Class Date',
      value: moment(trialClassDate).format('DD-MM-YYYY HH:MM'),
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
          <DialogTitle>Trial Class Registration Details</DialogTitle>
        </DialogHeader>
        <div className='flex gap-x-5 items-center my-3'>
          <h3 className='font-semibold text-xl'>{childName}</h3>
          <Badge variant={statusVariant}>
            {status[0] + status.substring(1).toLocaleLowerCase()}
          </Badge>
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

export default TrialClassDetail;

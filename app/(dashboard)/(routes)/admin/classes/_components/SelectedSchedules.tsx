'use client';

import { Schedule } from '@prisma/client';
import { IconCalendarCheck } from '@tabler/icons-react';
import { useClassFormStore } from '../_stores/use-class-form-store';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DateInput, TimeInput } from '@mantine/dates';
import { Input } from '@mantine/core';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const scheduleFormSchema = z.object({
  scheduleDate: z.date({
    required_error: 'Schedule date is required',
  }),
  startTime: z.string().min(1, {
    message: 'Start time is required',
  }),
  endTime: z.string().min(1, {
    message: 'End time is required',
  }),
  meetingUrl: z.string().optional(),
  recordingUrl: z.string().optional(),
});

interface SelectedSchedulesProps {
  schedules: Schedule[];
  handleEditSchedule: (
    id: string,
    values: z.infer<typeof scheduleFormSchema>
  ) => void;
}

const SelectedSchedules = ({
  schedules,
  handleEditSchedule,
}: SelectedSchedulesProps) => {
  const formType = useClassFormStore((state) => state.formType);
  const [selected, setSelected] = useState(schedules[0]);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof scheduleFormSchema>>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      scheduleDate: selected.scheduleDate,
      startTime: selected.scheduleTime.split(' - ')[0] || '',
      endTime: selected.scheduleTime.split(' - ')[1] || '',
      meetingUrl: selected.meetingUrl || '',
      recordingUrl: selected.recordingUrl || '',
    },
  });

  useEffect(() => {
    form.setValue('scheduleDate', selected.scheduleDate);
    form.setValue('startTime', selected.scheduleTime.split(' - ')[0] || '');
    form.setValue('endTime', selected.scheduleTime.split(' - ')[1] || '');
    form.setValue('meetingUrl', selected.meetingUrl || '');
    form.setValue('recordingUrl', selected.recordingUrl || '');
  }, [selected, form]);

  const onSubmit = (values: z.infer<typeof scheduleFormSchema>) => {
    setIsEditing(false);

    handleEditSchedule(selected.id, values);
  };

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  if (!schedules.length) return null;

  return (
    <div className='flex flex-col gap-5 p-5 border rounded-md'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <IconCalendarCheck className='text-primary-blue' />
          <h2 className='text-muted-foreground font-medium text-lg'>
            Schedules
          </h2>
        </div>
        {formType !== 'VIEW' && (
          <>
            {isEditing ? (
              <div className='flex items-center gap-2'>
                <Button
                  onClick={() => setIsEditing(false)}
                  type='button'
                  size='xs'
                  variant='light'
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} type='button' size='xs'>
                  Save
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                type='button'
                size='xs'
                variant='edit'
              >
                <Pencil className='h-3 w-3' />
                Edit
              </Button>
            )}
          </>
        )}
      </div>
      <hr />
      <div className='w-full'>
        <div className='overflow-x-auto flex gap-2 no-scrollbar'>
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={cn(
                'text-primary whitespace-nowrap cursor-pointer p-3 rounded-md',
                selected.id === schedule.id
                  ? 'bg-primary-blue text-white font-semibold'
                  : 'hover:bg-sky-200/20'
              )}
              onClick={() => {
                setIsEditing(false);
                setSelected(schedule);
              }}
            >
              Session {schedule.sessionNumber}
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5'
        >
          <FormField
            control={form.control}
            name='scheduleDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule Date</FormLabel>
                <FormControl>
                  <DateInput {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='startTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <TimeInput {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='endTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <TimeInput {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='meetingUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting URL</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='recordingUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recording URL</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default SelectedSchedules;

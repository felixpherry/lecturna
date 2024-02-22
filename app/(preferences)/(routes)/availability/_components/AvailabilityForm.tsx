'use client';

import { ComponentProps } from 'react';
import Banner from '@/components/shared/Banner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { MultiSelect } from '@mantine/core';
import { Course, MasterDay, MasterShift } from '@prisma/client';
import { CheckCircle2, CircleIcon, Loader2, Save, SunIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { saveInstructorAvailability } from '../_actions';
import { useRouter } from 'next/navigation';

export interface InstructorSchedule {
  dayId: string;
  shiftId: string;
}

type InstructorCourseScheduleFormProps = {
  days: MasterDay[];
  shifts: MasterShift[];
  courses: Course[];
} & ComponentProps<'div'>;

const formSchema = z.object({
  courses: z.string().array().min(1, {
    message: 'Choose at least 1 course',
  }),
  schedules: z
    .object({
      dayId: z.string(),
      shiftId: z.string(),
    })
    .array()
    .min(1, {
      message: 'Choose at least 1 shift',
    }),
});

const AvailabilityForm = ({
  days,
  shifts,
  courses,
}: InstructorCourseScheduleFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courses: [],
      schedules: [],
    },
  });

  const { isSubmitting } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await saveInstructorAvailability({
        instructorCourses: values.courses,
        instructorSchedules: values.schedules,
      });

      router.push('/instructor/dashboard');
      toast.success('Successfully saved data');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const courseOptions = courses.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const isScheduleActive = (
    schedules: InstructorSchedule[],
    dayId: string,
    shiftId: string
  ) => {
    return schedules.some(
      (schedule) => schedule.dayId === dayId && schedule.shiftId === shiftId
    );
  };

  const handleScheduleSelection = (
    schedules: InstructorSchedule[],
    dayId: string,
    shiftId: string,
    fieldChange: (value: InstructorSchedule[]) => void
  ) => {
    let newSchedules = [...schedules];
    if (isScheduleActive(newSchedules, dayId, shiftId)) {
      newSchedules = newSchedules.filter(
        (schedule) =>
          !(schedule.dayId === dayId && schedule.shiftId === shiftId)
      );
    } else {
      newSchedules = [...newSchedules, { dayId, shiftId }];
    }

    fieldChange(newSchedules);
  };

  return (
    <div className='mt-8 max-w-3xl'>
      <div className='flex flex-col gap-5'>
        <Banner
          variant='warning'
          label='Choose your course and schedule wisely, as changes will not be allowed until the next period.'
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='courses'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xl font-semibold text-primary'>
                    Choose Courses
                  </FormLabel>
                  <FormDescription>
                    Which courses would you like to teach?
                  </FormDescription>
                  <FormControl>
                    <MultiSelect
                      checkIconPosition='right'
                      data={courseOptions}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='schedules'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xl font-semibold text-primary'>
                    Choose Shifts
                  </FormLabel>
                  <FormControl>
                    <div className='flex flex-col gap-5'>
                      {days.map(({ id: dayId, day }) => (
                        <div key={dayId} className='flex flex-col gap-5'>
                          <div className='flex gap-3 items-center'>
                            <SunIcon className='h-5 w-5 text-yellow-500' />
                            <span className='font-semibold text-muted-foreground'>
                              {day[0] + day.substring(1).toLocaleLowerCase()}
                            </span>
                          </div>

                          <div className='grid gap-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5'>
                            {shifts.map(
                              ({ id: shiftId, startTime, endTime }) => {
                                const active = isScheduleActive(
                                  field.value,
                                  dayId,
                                  shiftId
                                );
                                return (
                                  <div
                                    className={cn(
                                      'flex gap-3 items-center p-5 rounded-lg font-medium cursor-pointer border w-full',
                                      active
                                        ? 'bg-primary-blue text-white shadow border-primary-blue'
                                        : 'text-secondary-foreground bg-secondary hover:shadow hover:bg-sky-200/20'
                                    )}
                                    key={`${dayId} - ${shiftId}`}
                                    onClick={() =>
                                      handleScheduleSelection(
                                        field.value,
                                        dayId,
                                        shiftId,
                                        field.onChange
                                      )
                                    }
                                  >
                                    {active ? (
                                      <CheckCircle2 className='h-4 w-4' />
                                    ) : (
                                      <CircleIcon className='h-4 w-4' />
                                    )}

                                    <span>
                                      {startTime} - {endTime}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='!mt-10 flex justify-end'>
              <Button size='sm' type='submit'>
                {isSubmitting ? (
                  <Loader2 className='animate-spin h-4 w-4' />
                ) : (
                  <Save className='h-4 w-4' />
                )}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AvailabilityForm;

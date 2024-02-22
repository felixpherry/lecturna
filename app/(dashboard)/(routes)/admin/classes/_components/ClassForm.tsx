'use client';

import { Button } from '@/components/ui/button';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import { toast } from 'sonner';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@mantine/core';

import { ClassTableInterface } from './columns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAvailableInstructors,
  getAvailableStudents,
  updateClass,
} from '../_actions';
import AvailableInstructorsTable from './AvailableInstructorsTable';
import SelectedInstructorTable from './SelectedInstructorTable';
import SelectedStudentsTable from './SelectedStudentsTable';
import AvailableStudentsTable from './AvailableStudentsTable';
import { Loader2, Pencil, Save } from 'lucide-react';
import { useClassFormStore } from '../_stores/use-class-form-store';
import SelectedSchedules, { scheduleFormSchema } from './SelectedSchedules';
import { Schedule } from '@prisma/client';
import { usePathname } from 'next/navigation';

interface ClassFormProps {
  initialData: ClassTableInterface;
}

const formSchema = z.object({
  studentCourseIds: z.string().array().min(1, {
    message: 'Class should have at least 1 student',
  }),
  instructorScheduleId: z.string().min(1, {
    message: 'Instructor is required',
  }),
});

const ClassForm = ({ initialData }: ClassFormProps) => {
  const formType = useClassFormStore((state) => state.formType);
  const setFormType = useClassFormStore((state) => state.setFormType);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instructorScheduleId: initialData?.instructorScheduleId || '',
      studentCourseIds: initialData?.studentCourses.map(({ id }) => id) || [],
    },
  });

  const [isEditingInstructor, setIsEditingInstructor] = useState(false);

  const [tempClass, setTempClass] = useState<ClassTableInterface>(initialData);

  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname()!;
  const queryClient = useQueryClient();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const { error, message } = await updateClass(tempClass, pathname);

      if (error !== null) throw new Error(message);
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ['available-instructors'],
      });
      queryClient.invalidateQueries({
        queryKey: ['available-students'],
      });
      modals.closeAll();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const { data: availableInstructors } = useQuery({
    queryKey: ['available-instructors', initialData.courseId, initialData.id],
    queryFn: ({ queryKey: [_, courseId, classId] }) =>
      getAvailableInstructors(courseId, classId),
  });

  const filteredInstructors = availableInstructors?.filter(
    ({ id }) => id !== tempClass.instructorScheduleId
  );

  const { data: availableStudents } = useQuery({
    queryKey: ['available-students', initialData.courseId, initialData.id],
    queryFn: ({ queryKey: [_, courseId, classId] }) =>
      getAvailableStudents(courseId, classId),
  });

  const filteredStudents = availableStudents?.filter(
    ({ id }) =>
      !tempClass.studentCourses.find((studentCourse) => studentCourse.id === id)
  );

  const handleSelectInstructor = (id: string) => {
    form.setValue('instructorScheduleId', id);
    setTempClass((prev) => ({
      ...prev,
      instructorScheduleId: id,
      instructorSchedule:
        availableInstructors?.find((instructor) => instructor.id === id) ||
        prev.instructorSchedule,
    }));
    setIsEditingInstructor(false);
  };

  const handleAddStudents = (studentIds: Set<string>) => {
    if (!studentIds.size) return;
    form.setValue('studentCourseIds', [
      ...form.getValues('studentCourseIds'),
      ...Array.from(studentIds),
    ]);

    setTempClass((prev) => ({
      ...prev,
      studentCourses: [
        ...prev.studentCourses,
        ...(availableStudents?.filter(({ id }) => studentIds.has(id)) || []),
      ],
    }));
  };

  const handleDeleteStudents = (studentIds: Set<string>) => {
    if (!studentIds.size) return;
    form.setValue(
      'studentCourseIds',
      form.getValues('studentCourseIds').filter((id) => !studentIds.has(id))
    );
    setTempClass((prev) => ({
      ...prev,
      studentCourses: prev.studentCourses.filter(
        ({ id }) => !studentIds.has(id)
      ),
    }));
  };

  const handleEditSchedule = (
    id: string,
    values: z.infer<typeof scheduleFormSchema>
  ) => {
    setTempClass({
      ...tempClass,
      schedules: tempClass.schedules.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            meetingUrl: values.meetingUrl || '',
            recordingUrl: values.recordingUrl || '',
            scheduleTime: `${values.startTime} - ${values.endTime}`,
            scheduleDate: values.scheduleDate,
          };
        }
        return item;
      }),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-5'
      >
        <FormLabel>Name</FormLabel>
        <Input value={initialData.name} disabled />

        <FormLabel>Course</FormLabel>
        <Input value={initialData.course.name} disabled />

        <FormLabel>Period</FormLabel>
        <Input value={initialData.period.name} disabled />
        <FormField
          control={form.control}
          name='instructorScheduleId'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {(isEditingInstructor || !field.value) &&
                formType !== 'VIEW' ? (
                  <AvailableInstructorsTable
                    instructorSchedules={filteredInstructors || []}
                    handleSelectInstructor={handleSelectInstructor}
                    setIsEditingInstructor={setIsEditingInstructor}
                  />
                ) : (
                  <SelectedInstructorTable
                    instructorSchedule={tempClass.instructorSchedule!}
                    setIsEditingInstructor={setIsEditingInstructor}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='studentCourseIds'
          render={() => (
            <FormItem>
              <FormControl>
                <>
                  <SelectedStudentsTable
                    studentCourses={tempClass.studentCourses}
                    handleDeleteStudents={handleDeleteStudents}
                    formType={formType}
                  />
                  {formType !== 'VIEW' && (
                    <AvailableStudentsTable
                      studentCourses={filteredStudents!}
                      handleAddStudents={handleAddStudents}
                    />
                  )}
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {tempClass.schedules.length > 0 && (
          <SelectedSchedules
            schedules={tempClass.schedules}
            handleEditSchedule={handleEditSchedule}
          />
        )}

        <div className='flex w-full items-center gap-3 justify-end border-t pt-4'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => modals.closeAll()}
          >
            Close
          </Button>
          {formType === 'VIEW' && (
            <Button
              type='button'
              variant='edit'
              size='sm'
              onClick={() => setFormType('EDIT')}
            >
              <Pencil className='w-4 h-4' />
              Edit
            </Button>
          )}
          {formType !== 'VIEW' && (
            <Button type='submit' size='sm'>
              {isLoading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Save className='w-4 h-4' />
              )}
              Save
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default ClassForm;

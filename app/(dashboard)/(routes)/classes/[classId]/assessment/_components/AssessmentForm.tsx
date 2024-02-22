'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MantineSelectOption } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { NumberInput, Select } from '@mantine/core';
import { modals } from '@mantine/modals';
import { Account, CourseEvaluation, Student } from '@prisma/client';
import { AlertTriangle, GraduationCap, Loader2, Save } from 'lucide-react';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import {
  addStudentScores,
  canFillAssessment,
  fetchStudentScores,
  updateStudentScores,
} from '../_actions';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface AssessmentFormProps {
  evaluations: CourseEvaluation[];
  students: ({
    account: Account;
  } & Student)[];
}

const formSchema = z.object({
  evaluationId: z
    .string({
      required_error: 'Evaluation is required',
      invalid_type_error: 'Evaluation is required',
    })
    .min(1, {
      message: 'Evaluation is required',
    }),
  studentScores: z.record(z.number()),
});

const AssessmentForm = ({ evaluations, students }: AssessmentFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      evaluationId: undefined,
      studentScores: {},
    },
  });

  const { isSubmitting } = form.formState;

  const params = useParams()!;
  const pathname = usePathname()!;

  const queryClient = useQueryClient();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (Object.keys(values.studentScores).length !== students.length)
      return form.setError('studentScores', {
        message: 'Required',
      });

    try {
      if (!studentScores?.length) {
        const { error, message } = await addStudentScores({
          classId: params.classId as string,
          evaluationId: values.evaluationId,
          pathname,
          studentScores: Object.entries(values.studentScores).map(
            ([studentId, score]) => ({
              studentId,
              score,
            })
          ),
        });
        if (error !== null) throw new Error(message);
        toast.success(message);
      } else {
        const { error, message } = await updateStudentScores({
          data: studentScores.map(({ id, studentId }) => ({
            studentScoreId: id,
            score: values.studentScores[studentId],
          })),
          pathname,
          classId: params.classId as string,
        });

        if (error !== null) throw new Error(message);
        toast.success(message);
      }
      queryClient.invalidateQueries({
        queryKey: [
          'assessment',
          {
            classId: params.classId,
            evaluationId: form.getValues('evaluationId'),
          },
        ],
      });

      modals.closeAll();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const evaluationOptions: MantineSelectOption[] = evaluations.map(
    ({ id, name }) => ({
      label: name,
      value: id,
    })
  );

  const { data: studentScores } = useQuery({
    queryKey: [
      'assessment',
      {
        classId: params.classId,
        evaluationId: form.watch('evaluationId'),
      },
    ],
    queryFn: async ({ queryKey }) => {
      const { classId, evaluationId } = queryKey[1] as {
        classId: string;
        evaluationId: string;
      };

      return await fetchStudentScores({
        classId,
        evaluationId,
      });
    },
    enabled: form.getValues('evaluationId') !== undefined,
  });

  const { data: canFill } = useQuery({
    queryKey: [
      'canFillAssessment',
      {
        classId: params.classId as string,
        action: studentScores?.length === 0 ? 'ADD' : 'EDIT',
      },
    ],
    queryFn: async ({ queryKey }) => {
      const { action, classId } = queryKey[1] as {
        classId: string;
        action: 'ADD' | 'EDIT';
      };
      return await canFillAssessment(classId, action);
    },
    staleTime: 60 * 1000,
  });

  const disabled = !canFill;

  useEffect(() => {
    if (studentScores?.length) {
      form.setValue(
        'studentScores',
        studentScores?.reduce((acc, curr) => {
          acc[curr.studentId] = curr.score ?? 0;
          return acc;
        }, {} as Record<string, number>) || {}
      );
    } else {
      form.setValue(
        'studentScores',
        students.reduce((acc, curr) => {
          acc[curr.id] = 0;
          return acc;
        }, {} as Record<string, number>)
      );
    }
  }, [studentScores, form, students]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-5 py-5'
      >
        <div className='p-3 bg-yellow-200 flex items-center gap-3'>
          <div className='flex items-center'>
            <AlertTriangle />
          </div>
          <p className='text-zinc-600'>
            The <b>deadline</b> for submitting assessment is <b>14 days</b>{' '}
            after the last session. You have a <b>7-day</b> window for edits
            after submission.
          </p>
        </div>
        <FormField
          control={form.control}
          name='evaluationId'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='flex items-center gap-5'>
                  <div className='text-zinc-500 text-sm'>Evaluation</div>
                  <Select
                    placeholder={
                      evaluationOptions.length
                        ? 'Choose evaluation'
                        : 'No evaluations'
                    }
                    data={evaluationOptions}
                    checkIconPosition='right'
                    {...field}
                    unselectable='on'
                    disabled={!evaluationOptions.length}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='p-3 flex flex-col gap-3 border'>
          <div className='pb-3 border-b'>
            <h3 className='text-zinc-600 text-base font-semibold flex items-center gap-3'>
              <GraduationCap className='h-5 w-5 text-primary-blue' />
              Students
            </h3>
          </div>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-primary'>No.</TableHead>
                  <TableHead className='text-primary'>Student</TableHead>
                  <TableHead className='text-primary'>Student ID</TableHead>
                  <TableHead className='text-primary'>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(({ id, account, studentId }, idx) => (
                  <TableRow key={id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <div className='flex gap-5 items-center'>
                        <Image
                          src={account.image || '/avatar-fallback.svg'}
                          alt={account.name || ''}
                          width={25}
                          height={25}
                          className='rounded-full'
                        />
                        <div className='flex flex-col'>
                          <h3 className='text-primary text-sm font-semibold'>
                            {account.name}
                          </h3>
                          <p className='text-muted-foreground text-xs'>
                            {account.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='font-semibold'>{studentId}</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name='studentScores'
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <NumberInput
                                className='w-14'
                                min={0}
                                max={100}
                                hideControls
                                value={field.value[id]}
                                onChange={(score) =>
                                  field.onChange({
                                    ...field.value,
                                    [id]: score,
                                  })
                                }
                                error={
                                  fieldState.invalid &&
                                  field.value[id] === undefined
                                }
                                disabled={
                                  !form.getValues('evaluationId') || disabled
                                }
                              />
                            </FormControl>
                            {field.value[id] === undefined && <FormMessage />}
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className='flex justify-end items-center gap-3'>
          <Button
            type='button'
            onClick={() => modals.closeAll()}
            size='sm'
            variant='light'
          >
            Close
          </Button>
          {evaluationOptions.length > 0 && !disabled && (
            <Button size='sm'>
              {isSubmitting ? (
                <Loader2 className='h-4 w-4 animate-spin' />
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

export default AssessmentForm;

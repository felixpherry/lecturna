'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@mantine/core';
import { useState } from 'react';
import {
  MappedClass,
  useCreateClassStore,
} from '../../_stores/use-create-class-store';
import {
  EyeIcon,
  Loader2,
  PencilIcon,
  SaveAll,
  Trash2,
  Undo2,
} from 'lucide-react';
import { convertToTitleCase } from '@/lib/utils';
import MappedClassForm from './MappedClassForm';
import { modals } from '@mantine/modals';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createClassesForNextPeriod } from '@/lib/actions/class.actions';
import Pagination from '@/components/shared/Pagination';
import { getNextPeriod } from '@/lib/actions/period.actions';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import {
  MappedClassFormType,
  useMappedClassForm,
} from '../../_stores/use-mapped-class-form';
import Banner from '@/components/shared/Banner';

const MappedClassesTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const mappedClasses = useCreateClassStore((state) => state.mappedClasses);
  const setMappedClasses = useCreateClassStore(
    (state) => state.setMappedClasses
  );

  const filteredMappedClasses = mappedClasses.filter(({ id, name }) => {
    return name.toLocaleLowerCase().includes(search.toLocaleLowerCase());
  });

  const currMappedClasses = filteredMappedClasses.slice(
    (page - 1) * 10,
    (page - 1) * 10 + 10
  );

  const setFormType = useMappedClassForm((state) => state.setFormType);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = (id: string) => {
    setMappedClasses(
      mappedClasses.filter((mappedClass) => mappedClass.id !== id)
    );

    toast.success('Successfully deleted class');
  };

  const openModalForm = (
    mappedClass: MappedClass,
    type: MappedClassFormType
  ) => {
    const title = type === 'EDIT' ? 'Edit Class' : 'Class Details';
    setFormType(type);
    modals.open({
      title: <h1 className='text-primary text-lg font-bold'>{title}</h1>,
      children: <MappedClassForm initialMappedClass={mappedClass} />,
      size: 'xl',
    });
  };

  const courses = useCreateClassStore((state) => state.courses);
  const getCourse = (id: string) => {
    return courses.find((course) => course.id === id);
  };

  const instructorSchedules = useCreateClassStore(
    (state) => state.instructorSchedules
  );
  const getInstructorSchedule = (id: string) => {
    return instructorSchedules.find(
      (instructorSchedule) => instructorSchedule.id === id
    );
  };

  const getFormattedSchedule = (id: string) => {
    const instructorSchedule = getInstructorSchedule(id);
    if (!instructorSchedule) return '';

    return `${convertToTitleCase(instructorSchedule.day.day)}, ${
      instructorSchedule.shift.startTime
    } - ${instructorSchedule.shift.endTime}`;
  };

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error, message } = await createClassesForNextPeriod({
        mappedClasses,
      });
      if (error !== null) throw new Error(message);
      const nextPeriod = await getNextPeriod();
      setMappedClasses([]);
      toast.success(message);
      router.push(`/admin/classes?period=${nextPeriod?.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (!mappedClasses.length) return;

    setMappedClasses([]);
    toast.success('Successfully reset results');
  };

  const headers = ['No.', 'Name', 'Course', 'Schedule', 'Actions'];

  return (
    <div className='flex flex-col gap-3 p-5 border rounded-md'>
      {!!currMappedClasses.length && (
        <Banner label='These classes are stored locally. Please finalize the process to store them in the database.' />
      )}
      <div className='flex justify-between'>
        <Input
          placeholder='Search class...'
          value={search}
          onChange={handleSearch}
          className='md:w-1/3'
        />
        <div className='flex items-center gap-3'>
          <ConfirmModal
            title='Are you sure?'
            description='Do you want to reset the results?'
            variant={{ confirm: 'destructive' }}
            onConfirm={handleReset}
          >
            <Button
              disabled={!mappedClasses.length}
              variant='destructive'
              className='flex items-center'
              size='sm'
            >
              <Undo2 className='h-4 w-4' />
              Reset
            </Button>
          </ConfirmModal>
          <ConfirmModal
            title='Are you sure?'
            description='Do you want to save the results?'
            onConfirm={handleSave}
          >
            <Button
              disabled={!mappedClasses.length}
              className='flex items-center'
              size='sm'
            >
              {isLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <SaveAll className='h-4 w-4' />
              )}
              Finalize
            </Button>
          </ConfirmModal>
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead
                  key={header}
                  className='text-muted-foreground font-semibold text-base'
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currMappedClasses.map(
              (
                { id, name, courseId, instructorScheduleId, studentCourseIds },
                idx
              ) => (
                <TableRow key={id}>
                  <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                  <TableCell className='text-primary font-bold'>
                    {name}
                  </TableCell>
                  <TableCell className='text-muted-foreground font-semibold'>
                    {getCourse(courseId)?.name}
                  </TableCell>
                  <TableCell className='text-muted-foreground font-semibold'>
                    {getFormattedSchedule(instructorScheduleId)}
                  </TableCell>
                  <TableCell className='text-muted-foreground font-semibold'>
                    <div className='flex items-center gap-4'>
                      <EyeIcon
                        onClick={() =>
                          openModalForm(
                            {
                              id,
                              name,
                              courseId,
                              instructorScheduleId,
                              studentCourseIds,
                            },
                            'VIEW'
                          )
                        }
                        className='h-5 w-5 cursor-pointer text-muted-foreground hover:text-primary'
                      />
                      <PencilIcon
                        onClick={() =>
                          openModalForm(
                            {
                              id,
                              name,
                              courseId,
                              instructorScheduleId,
                              studentCourseIds,
                            },
                            'EDIT'
                          )
                        }
                        className='h-5 w-5 cursor-pointer text-primary-blue'
                      />
                      <ConfirmModal
                        title='Are you sure?'
                        description='Do you want to delete this class?'
                        onConfirm={() => handleDelete(id)}
                      >
                        <Trash2 className='h-5 w-5 cursor-pointer text-red-500' />
                      </ConfirmModal>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
      {filteredMappedClasses.length === 0 && (
        <p className='text-primary text-base font-semibold text-center'>
          No Classes
        </p>
      )}
      <Pagination
        getNextPage={() => setPage(page + 1)}
        getPrevPage={() => setPage(page - 1)}
        limit={10}
        withSearchParams={false}
        page={page}
        count={filteredMappedClasses.length}
      />
    </div>
  );
};

export default MappedClassesTable;

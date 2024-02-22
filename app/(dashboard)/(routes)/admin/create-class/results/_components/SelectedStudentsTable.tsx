'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCreateClassStore } from '../../_stores/use-create-class-store';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { IconCircleCheck } from '@tabler/icons-react';
import { Checkbox, Input } from '@mantine/core';
import { cn } from '@/lib/utils';
import { useMappedClassForm } from '../../_stores/use-mapped-class-form';

interface SelectedStudentsTableProps {
  studentCourseIds: string[];
  handleDeleteStudents: (selected: Set<string>) => void;
}

const SelectedStudentsTable = ({
  studentCourseIds,
  handleDeleteStudents,
}: SelectedStudentsTableProps) => {
  const [selected, setSelected] = useState(new Set<string>());
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearch(e.target.value);
  };

  const formType = useMappedClassForm((state) => state.formType);

  const studentCourses = useCreateClassStore((state) => state.studentCourses);
  const getStudentCourse = (id: string) => {
    return studentCourses.find((studentCourse) => studentCourse.id === id);
  };

  const filteredStudentCourseIds = studentCourseIds.filter((id) => {
    const account = getStudentCourse(id)?.student.account;
    if (!account) return false;
    return (
      account.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      account.email.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  });
  const currStudentCourseIds = filteredStudentCourseIds.slice(
    (page - 1) * 5,
    (page - 1) * 5 + 5
  );

  const hasNextPage =
    (page - 1) * 5 + currStudentCourseIds.length <
    filteredStudentCourseIds.length;
  const hasPrevPage = page !== 1;

  const handleSelect = (id: string) => {
    const cloneSelected = structuredClone(selected);
    if (cloneSelected.has(id)) cloneSelected.delete(id);
    else cloneSelected.add(id);
    setSelected(cloneSelected);
  };

  const isAllSelected =
    currStudentCourseIds.every((id) => selected.has(id)) && selected.size > 0;

  const handleSelectAll = () => {
    const cloneSelected = structuredClone(selected);
    if (isAllSelected) {
      setSelected(new Set<string>());
    } else {
      currStudentCourseIds.forEach((id) => {
        cloneSelected.add(id);
      });
      setSelected(cloneSelected);
    }
  };

  const handleMassDelete = () => {
    handleDeleteStudents(selected);
    setSelected(new Set<string>());
  };

  return (
    <div className='flex flex-col gap-3 p-5 border rounded-md'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <IconCircleCheck className='text-primary-blue' />
          <h2 className='text-muted-foreground font-medium text-lg'>
            Selected Students
          </h2>
        </div>
        {formType !== 'VIEW' && (
          <Button
            type='button'
            variant='destructive'
            size='xs'
            className='flex items-center gap-1'
            onClick={handleMassDelete}
          >
            <Trash2 className='h-3 w-3' />
            Delete
          </Button>
        )}
      </div>
      <hr />
      <Input
        placeholder='Search student...'
        value={search}
        onChange={handleSearch}
        className='md:w-1/2'
      />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {formType !== 'VIEW' && (
                <TableHead>
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableHead>
              )}
              <TableHead className='text-primary'>No.</TableHead>
              <TableHead className='text-primary'>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currStudentCourseIds.map((id, idx) => (
              <TableRow
                key={id}
                onClick={() => (formType !== 'VIEW' ? handleSelect(id) : null)}
                className={cn(formType !== 'VIEW' && 'cursor-pointer')}
              >
                {formType !== 'VIEW' && (
                  <TableCell>
                    <Checkbox checked={selected.has(id)} readOnly />
                  </TableCell>
                )}
                <TableCell>{(page - 1) * 5 + idx + 1}</TableCell>
                <TableCell>
                  <div className='flex gap-5 items-center'>
                    <Image
                      src={
                        getStudentCourse(id)?.student.account.image ||
                        '/avatar-fallback.svg'
                      }
                      alt={getStudentCourse(id)?.student.account.name || ''}
                      width={25}
                      height={25}
                      className='rounded-full'
                    />
                    <div className='flex flex-col'>
                      <h3 className='text-primary text-sm font-semibold'>
                        {getStudentCourse(id)?.student.account.name}
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        {getStudentCourse(id)?.student.account.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {currStudentCourseIds.length === 0 && (
        <p className='text-primary text-base font-semibold text-center'>
          No Students
        </p>
      )}
      <div className='flex justify-between items-center'>
        <p className='text-xs text-muted-foreground'>
          Showing {(page - 1) * 5 + 1} to{' '}
          {(page - 1) * 5 + currStudentCourseIds.length} of{' '}
          {filteredStudentCourseIds.length} entries
        </p>
        <div className='flex items-center gap-1'>
          <Button
            type='button'
            onClick={() => setPage(page - 1)}
            disabled={!hasPrevPage}
            variant='outline'
            size='xs'
          >
            Prev
          </Button>
          <Button
            type='button'
            size='xs'
            variant='primary-blue'
            className='w-8'
            disabled
          >
            {page}
          </Button>
          <Button
            type='button'
            onClick={() => setPage(page + 1)}
            disabled={!hasNextPage}
            variant='outline'
            size='xs'
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectedStudentsTable;

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Checkbox, Input } from '@mantine/core';
import { StudentCourseTableInterface } from './SelectedStudentsTable';

interface AvailableStudentsTableProps {
  studentCourses: StudentCourseTableInterface[];
  handleAddStudents: (selected: Set<string>) => void;
}

const AvailableStudentsTable = ({
  studentCourses,
  handleAddStudents,
}: AvailableStudentsTableProps) => {
  const [selected, setSelected] = useState(new Set<string>());
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearch(e.target.value);
  };

  const filteredStudentCourses = studentCourses?.filter(({ id, student }) => {
    const { account } = student;
    if (!account) return false;
    return (
      account.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      account.email.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  });

  if (!filteredStudentCourses) return null;

  const currStudentCourses = filteredStudentCourses.slice(
    (page - 1) * 5,
    (page - 1) * 5 + 5
  );
  const hasNextPage =
    (page - 1) * 5 + currStudentCourses.length < filteredStudentCourses.length;
  const hasPrevPage = page !== 1;

  const handleSelect = (id: string) => {
    const cloneSelected = structuredClone(selected);
    if (cloneSelected.has(id)) cloneSelected.delete(id);
    else cloneSelected.add(id);
    setSelected(cloneSelected);
  };

  const isAllSelected =
    currStudentCourses.every(({ id }) => selected.has(id)) && selected.size > 0;

  const handleSelectAll = () => {
    const cloneSelected = structuredClone(selected);
    if (isAllSelected) {
      setSelected(new Set<string>());
    } else {
      currStudentCourses.forEach(({ id }) => {
        cloneSelected.add(id);
      });
      setSelected(cloneSelected);
    }
  };

  const handleAdd = () => {
    handleAddStudents(selected);
    setSelected(new Set<string>());
  };

  return (
    <div className='flex flex-col gap-3 p-5 border rounded-md'>
      <div className='flex justify-between items-center'>
        <h2 className='text-muted-foreground font-medium text-lg'>Students</h2>

        <Button
          type='button'
          variant='primary-blue'
          size='xs'
          className='flex items-center gap-1'
          onClick={handleAdd}
        >
          <Plus className='h-3 w-3' />
          Add
        </Button>
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
              <TableHead>
                <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
              </TableHead>
              <TableHead className='text-primary'>No.</TableHead>
              <TableHead className='text-primary'>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currStudentCourses.map(({ id, student }, idx) => (
              <TableRow
                key={id}
                onClick={() => handleSelect(id)}
                className='cursor-pointer'
              >
                <TableCell>
                  <Checkbox checked={selected.has(id)} readOnly />
                </TableCell>
                <TableCell>{(page - 1) * 5 + idx + 1}</TableCell>
                <TableCell>
                  <div className='flex gap-5 items-center'>
                    <Image
                      src={student.account.image || '/avatar-fallback.svg'}
                      alt={student.account.name || ''}
                      width={25}
                      height={25}
                      className='rounded-full'
                    />
                    <div className='flex flex-col'>
                      <h3 className='text-primary text-sm font-semibold'>
                        {student.account.name}
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        {student.account.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {currStudentCourses.length === 0 && (
        <p className='text-primary text-base font-semibold text-center'>
          No Students
        </p>
      )}
      <div className='flex justify-between items-center'>
        <p className='text-xs text-muted-foreground'>
          Showing {(page - 1) * 5 + 1} to{' '}
          {(page - 1) * 5 + currStudentCourses.length} of{' '}
          {filteredStudentCourses.length} entries
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

export default AvailableStudentsTable;

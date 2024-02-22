import ActionTooltip from '@/components/shared/ActionTooltip';
import BackButton from '@/components/shared/BackButton';
import FilterSelect from '@/components/shared/FilterSelect';
import { Button } from '@/components/ui/button';
import { getCurrentPeriod } from '@/lib/actions/period.actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { cn, convertToTitleCase } from '@/lib/utils';
import { MantineSelectOption, SessionInterface } from '@/types';
import {
  BadgeCheck,
  CalendarDays,
  CalendarX2,
  Code2,
  File,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

interface PageProps {
  params: {
    accountId: string;
  };
  searchParams: {
    schedulePeriodId?: string;
    classPeriodId?: string;
  };
}

const Page = async ({ params: { accountId }, searchParams }: PageProps) => {
  const session = (await getCurrentUser()) as SessionInterface;

  if (!session) return redirect('/login');

  const currentPeriod = await getCurrentPeriod();

  const periods = await db.period.findMany({
    where: {
      isActive: true,
    },
  });

  const periodOptions: MantineSelectOption[] = periods.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const accountDetail = await db.account.findUnique({
    where: {
      id: accountId,
    },
    include: {
      student: {
        include: {
          studentCourses: {
            include: {
              course: true,
              class: true,
            },
          },
          parent: {
            include: {
              account: true,
            },
          },
        },
      },
      instructor: {
        include: {
          instructorSchedules: {
            include: {
              day: true,
              shift: true,
              period: true,
            },
            where: {
              periodId: searchParams.schedulePeriodId ?? currentPeriod?.id,
            },
          },
          instructorCourses: {
            include: {
              course: {
                include: {
                  classes: true,
                },
              },
            },
            where: {
              periodId: searchParams.classPeriodId ?? currentPeriod?.id,
            },
          },
          skills: true,
        },
      },
      parent: {
        include: {
          children: {
            include: {
              account: true,
            },
          },
        },
      },
    },
  });

  if (!accountDetail) return notFound();
  const isOwner = session.user.id === accountDetail.id;
  const isAdmin = session.user.role === 'ADMIN';
  const isParent = session.user.id === accountDetail.student?.parent.accountId;
  const isChild =
    session.user.id === accountDetail.parent?.children[0].accountId;

  if (!isOwner && !isAdmin && !isParent && !isChild) return notFound();

  const accountDetailMap = [
    {
      label: 'Email',
      value: accountDetail?.email || '-',
      icon: Mail,
    },
    {
      label: 'Phone Number',
      value: accountDetail?.phoneNumber || '-',
      icon: Phone,
    },
    {
      label: 'Address',
      value: accountDetail?.address || '-',
      icon: MapPin,
    },
  ];

  const studentInformationMap = accountDetail.student
    ? [
        {
          label: 'Student ID',
          value: accountDetail?.student?.studentId || '-',
        },
        {
          label: 'Date of Birth',
          value:
            moment(accountDetail?.student?.dateOfBirth).format(
              'DD MMMM YYYY'
            ) || '-',
        },
        {
          label: 'Place of Birth',
          value: accountDetail?.student?.birthPlace,
        },
        {
          label: 'Gender',
          value: convertToTitleCase(accountDetail?.student?.gender || ''),
        },
        {
          label: 'Grade/Class',
          value: accountDetail?.student?.gradeClass,
        },
        {
          label: 'Education Institution',
          value: accountDetail?.student?.educationInstitution,
        },
        {
          label: 'Hobby',
          value: accountDetail?.student?.hobby || '-',
        },
        {
          label: 'Ambition',
          value: accountDetail?.student?.ambition || '-',
        },
      ]
    : null;

  const instructorInformationMap = accountDetail.instructor
    ? [
        {
          label: 'Date of Birth',
          value:
            moment(accountDetail?.student?.dateOfBirth).format(
              'DD MMMM YYYY'
            ) || '-',
        },
        {
          label: 'Last Education',
          value: accountDetail.instructor.lastEducation || '-',
        },
        {
          label: 'Education Institution',
          value: accountDetail.instructor.educationInstitution || '-',
        },
        {
          label: 'ID Card',
          href: accountDetail.instructor.fileIDCard || null,
        },
        {
          label: 'NPWP',
          href: accountDetail.instructor.fileNPWP || null,
        },
        {
          label: 'Skills',
          value: accountDetail.instructor.skills
            .map(({ name }) => name)
            .join(', '),
        },
      ]
    : null;

  const mappedInstructorSchedule = accountDetail.instructor?.instructorSchedules
    .length
    ? accountDetail.instructor.instructorSchedules.reduce((acc, curr) => {
        if (acc[curr.day.day]) {
          acc[curr.day.day].push(
            `${curr.shift.startTime} - ${curr.shift.endTime}`
          );
        } else
          acc[curr.day.day] = [
            `${curr.shift.startTime} - ${curr.shift.endTime}`,
          ];
        return acc;
      }, {} as Record<string, string[]>)
    : null;

  const studentClasses = accountDetail.student
    ? accountDetail.student.studentCourses.filter(
        (studentCourse) => studentCourse.class !== null
      )
    : null;

  return (
    <div className='flex flex-col gap-5'>
      <BackButton />
      <div className='flex flex-col gap-6 bg-white p-8 rounded-md shadow'>
        <div className='flex flex-col md:flex-row md:justify-between items-start gap-5'>
          <div className='flex flex-col md:flex-row md:items-center gap-5'>
            <Image
              src={
                accountDetail.image ||
                (isOwner && session.user.image) ||
                '/avatar-fallback.svg'
              }
              alt='Profile Photo'
              width={128}
              height={128}
              className='rounded-full h-32 w-32'
            />
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-1'>
                <h3 className='font-bold text-2xl flex items-center gap-2'>
                  {accountDetail?.name}{' '}
                  {accountDetail.onboarded && (
                    <ActionTooltip label='Onboarded'>
                      <BadgeCheck className='text-emerald-400 h-6 w-6' />
                    </ActionTooltip>
                  )}
                </h3>
                <p className='text-base'>
                  {accountDetail?.username ? `@${accountDetail.username}` : '-'}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <CalendarDays className='h-4 w-4' />
                Joined {moment(accountDetail?.createdAt).format('MMMM YYYY')}
              </div>
            </div>
          </div>
          {isOwner && (
            <>
              <Button
                variant='edit'
                className='shadow-sm hidden md:flex'
                size='sm'
                asChild
              >
                <Link href={`/profile/${session.user.id}/edit`}>
                  <Pencil className='h-4 w-4' />
                  Edit
                </Link>
              </Button>

              <Button
                className='block md:hidden w-full rounded-full font-sans'
                variant='primary-blue-outline'
                size='sm'
              >
                <Link href={`/profile/${session.user.id}/edit`}>
                  Edit Profile
                </Link>
              </Button>
            </>
          )}
        </div>

        <div className='flex items-center gap-x-6 gap-y-3 flex-wrap'>
          {accountDetailMap.map(({ icon: Icon, label, value }) => (
            <div key={label} className='flex items-center gap-1'>
              <ActionTooltip label={label}>
                <Icon className='w-4 h-4' />
              </ActionTooltip>
              {value}
            </div>
          ))}
        </div>
      </div>

      {studentInformationMap && (
        <div className='flex flex-col gap-5 rounded-md shadow bg-white p-5'>
          <h3 className='text-xl font-bold text-primary pb-3 border-b'>
            Student Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            {studentInformationMap.map(({ label, value }) => (
              <div key={label} className='flex flex-col'>
                <h5 className='text-primary font-semibold'>{label}</h5>
                <p className='text-muted-foreground'>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {instructorInformationMap && (
        <div className='flex flex-col gap-5 rounded-md shadow bg-white p-5'>
          <h3 className='text-xl font-bold text-primary pb-3 border-b'>
            Instructor Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            {instructorInformationMap.map(({ label, href, value }) => (
              <div key={label} className='flex flex-col'>
                <h5 className='text-primary font-semibold'>{label}</h5>
                {href ? (
                  <a
                    className='flex items-center gap-1 text-primary-blue hover:underline font-medium'
                    href={href}
                    target='_blank'
                  >
                    <File className='h-4 w-4' /> File {label}
                  </a>
                ) : (
                  <p className='text-muted-foreground'>{value || '-'}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {accountDetail.instructor !== null && (
        <div className='flex flex-col gap-5 rounded-md shadow bg-white p-5'>
          <h3 className='text-xl font-bold text-primary pb-3 border-b'>
            Schedules
          </h3>
          <div className='flex gap-3 items-center'>
            <p className='font-semibold text-primary'>Period:</p>
            <FilterSelect
              options={periodOptions}
              withSearchParams
              searchParamsKey='schedulePeriodId'
              defaultValue={currentPeriod?.id}
              className='w-full md:w-1/2 lg:w-1/3'
            />
          </div>
          {mappedInstructorSchedule !== null &&
          Object.keys(mappedInstructorSchedule).length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5'>
              {Object.entries(mappedInstructorSchedule).map(
                ([day, shifts], idx) => {
                  return (
                    <>
                      <div
                        key={day}
                        className='flex flex-col text-center shadow-lg rounded-lg'
                      >
                        <p
                          className={cn(
                            'font-bold text-muted-foreground py-5 rounded-t-lg text-white',
                            idx % 2 === 0
                              ? 'bg-primary-blue'
                              : 'bg-primary-yellow'
                          )}
                        >
                          {day}
                        </p>
                        <div
                          className={cn(
                            'flex flex-col gap-3 px-8 pb-5 h-full pt-3',
                            idx % 2 === 0 ? 'bg-[#e9f0ff]' : 'bg-[#fff8e1]'
                          )}
                        >
                          {shifts.map((shift, idx) => (
                            <>
                              <p
                                className='font-medium px-8'
                                key={`${day} - ${shift}`}
                              >
                                {shift}
                              </p>
                              {idx < shifts.length - 1 && (
                                <hr className='bg-primary' />
                              )}
                            </>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                }
              )}
            </div>
          ) : (
            <div className='flex items-center justify-center flex-col gap-5 flex-1 mt-5'>
              <CalendarX2 className='text-muted-foreground h-24 w-24' />
              <div className='flex flex-col gap-1 justify-center items-center'>
                <h3 className='text-primary font-semibold text-xl'>
                  No Schedule
                </h3>
                <p className='text-muted-foreground'>
                  There is no schedule available.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {accountDetail.instructor !== null && (
        <div className='flex flex-col gap-5 rounded-md shadow bg-white p-5'>
          <h3 className='text-xl font-bold text-primary pb-3 border-b'>
            Classes
          </h3>
          <div className='flex gap-3 items-center'>
            <p className='font-semibold text-primary'>Period:</p>
            <FilterSelect
              options={periodOptions}
              withSearchParams
              searchParamsKey='classPeriodId'
              defaultValue={currentPeriod?.id}
              className='w-full md:w-1/2 lg:w-1/3'
            />
          </div>
          {accountDetail.instructor.instructorCourses.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5'>
              {accountDetail.instructor.instructorCourses.map(({ course }) =>
                course.classes.map((classData) => (
                  <Link
                    href={`/classes/${classData.id}`}
                    key={course.id}
                    className='bg-white rounded-md shadow'
                  >
                    <Image
                      alt={course.name}
                      src={course.image || ''}
                      height={300}
                      width={300}
                      className='w-full h-40 object-cover rounded-t-md'
                    />
                    <div className='p-5 flex flex-col gap-2'>
                      <h3 className='text-primary font-semibold text-xl'>
                        {course.name} - {classData.name}
                      </h3>
                      <p className='text-muted-foreground'>{course.code}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          ) : (
            <div className='flex items-center justify-center flex-col gap-5 flex-1 mt-5'>
              <Code2 className='text-muted-foreground h-24 w-24' />
              <div className='flex flex-col gap-1 justify-center items-center'>
                <h3 className='text-primary font-semibold text-xl'>No Class</h3>
                <p className='text-muted-foreground'>
                  There is no class available.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {accountDetail.student !== null && (
        <div className='p-5 rounded-md shadow bg-white flex flex-col gap-5'>
          <h3 className='text-xl font-bold text-primary pb-3 border-b'>
            Parent Information
          </h3>
          <div className='flex gap-5'>
            <Image
              src={
                accountDetail.student.parent.account.image ||
                '/avatar-fallback.svg'
              }
              alt={accountDetail.student.parent.account.name}
              className='w-16 h-16 rounded-full'
              width={64}
              height={64}
            />
            <div className='flex flex-col gap-1'>
              <h4 className='text-primary font-semibold text-lg'>
                {accountDetail.student.parent.account.name}
              </h4>
              <p className='text-muted-foreground'>
                {accountDetail.student.parent.account.email}
              </p>
            </div>
          </div>
          <Button size='sm' className='w-fit' asChild>
            <Link href={`/profile/${accountDetail.student.parent.accountId}`}>
              View Details
            </Link>
          </Button>
        </div>
      )}

      {accountDetail.student !== null && (
        <div className='flex flex-col gap-5 rounded-md shadow bg-white p-5'>
          <h3 className='text-xl font-bold text-primary pb-3 border-b'>
            Classes
          </h3>
          <div className='flex gap-3 items-center'>
            <p className='font-semibold text-primary'>Period:</p>
            <FilterSelect
              options={periodOptions}
              withSearchParams
              searchParamsKey='classPeriodId'
              defaultValue={currentPeriod?.id}
              className='w-full md:w-1/2 lg:w-1/3'
            />
          </div>
          {studentClasses && studentClasses.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-5 mt-5'>
              {studentClasses.map(({ course, class: classData }) => (
                <Link
                  key={classData!.id}
                  href={`/classes/${classData?.id}`}
                  className='bg-white rounded-md shadow'
                >
                  <Image
                    alt={course.name}
                    src={course.image || ''}
                    height={300}
                    width={300}
                    className='w-full h-40 object-cover rounded-t-md'
                  />
                  <div className='p-5 flex flex-col gap-2'>
                    <h3 className='text-primary font-semibold text-xl'>
                      {course.name} - {classData!.name}
                    </h3>
                    <p className='text-muted-foreground'>{course.code}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className='flex items-center justify-center flex-col gap-5 flex-1 mt-5'>
              <File className='text-muted-foreground h-24 w-24' />
              <div className='flex flex-col gap-1 justify-center items-center'>
                <h3 className='text-primary font-semibold text-xl'>No Class</h3>
                <p className='text-muted-foreground'>
                  There is no class available.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {accountDetail.parent !== null && (
        <div className='p-5 rounded-md shadow bg-white flex flex-col gap-5'>
          <h3 className='text-xl font-bold text-primary pb-3 border-b'>
            Child Information
          </h3>
          <div className='flex gap-5'>
            <Image
              src={
                accountDetail.parent.children[0].account.image ||
                '/avatar-fallback.svg'
              }
              alt={accountDetail.parent.children[0].account.name}
              className='w-16 h-16 rounded-full'
              width={64}
              height={64}
            />
            <div className='flex flex-col gap-1'>
              <h4 className='text-primary font-semibold text-lg'>
                {accountDetail.parent.children[0].account.name}
              </h4>
              <p className='text-muted-foreground'>
                {accountDetail.parent.children[0].account.email}
              </p>
            </div>
          </div>
          <Button size='sm' className='w-fit' asChild>
            <Link
              href={`/profile/${accountDetail.parent.children[0].accountId}`}
            >
              View Details
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;

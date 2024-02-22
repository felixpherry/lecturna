import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';
import {
  Code,
  GraduationCap,
  Mail,
  Presentation,
  ScrollText,
  SquareCode,
  UserCheck,
} from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = (await getCurrentUser()) as SessionInterface;

  const accountDetail = await db.account.findUnique({
    where: { id: session.user.id },
  });

  if (!accountDetail) return redirect('/not-found');

  const [
    totalInstructors,
    totalStudents,
    totalClasses,
    totalCourses,
    totalPrograms,
    courseRegistrations,
    instructorRegistrations,
    trialClassRegistrations,
  ] = await Promise.all([
    db.account.count({
      where: { role: 'INSTRUCTOR' },
    }),
    db.account.count({
      where: { role: 'STUDENT' },
    }),
    db.class.count(),
    db.course.count({
      where: {
        isPublished: true,
        isDeleted: false,
        program: {
          isPublished: true,
          isDeleted: false,
        },
      },
    }),
    db.program.count({
      where: { isPublished: true, isDeleted: false },
    }),
    db.courseRegistration.findMany({
      where: { status: 'PENDING' },
      orderBy: {
        createdAt: 'desc',
      },
      include: { course: true },
      take: 3,
    }),
    db.instructorRegistration.findMany({
      where: { status: 'PENDING' },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    }),
    db.trialClassRegistration.findMany({
      where: { status: 'PENDING' },
      orderBy: {
        createdAt: 'desc',
      },
      include: { course: true },
      take: 3,
    }),
  ]);

  const statistics = [
    {
      label: 'Total Classes',
      value: totalClasses,
      icon: Presentation,
    },
    {
      label: 'Total Courses',
      value: totalCourses,
      icon: Code,
    },
    {
      label: 'Total Programs',
      value: totalPrograms,
      icon: SquareCode,
    },
    {
      label: 'Total Students',
      value: totalStudents,
      icon: GraduationCap,
    },
    {
      label: 'Total Instructors',
      value: totalInstructors,
      icon: UserCheck,
    },
  ];

  return (
    <div className='flex flex-col gap-5 font-josefin container max-w-7xl p-0'>
      <h1 className='font-extrabold text-3xl'>Dashboard</h1>
      <div className='flex flex-col-reverse md:flex-row gap-5'>
        <div className='w-full md:w-2/3 flex flex-col gap-5'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
            {statistics.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className='p-8 bg-[#e3e5fe] rounded-md shadow-sm'
              >
                <div className='flex flex-col gap-5'>
                  <div className='flex justify-between items-start'>
                    <h3 className='font-extrabold text-4xl'>{value}</h3>
                    <div className='h-8 w-8 flex justify-center items-center shadow-lg rounded-full bg-sky-200/20'>
                      <Icon className='text-primary-blue' />
                    </div>
                  </div>
                  <p className='text-muted-foreground text-lg'>{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='flex flex-col gap-5'>
            <div className='flex justify-between items-center'>
              <h2 className='font-extrabold text-2xl'>Course Registration</h2>
              <Link
                href='/admin/registrations/courses'
                className='text-primary-blue hover:underline text-sm font-medium'
              >
                View All
              </Link>
            </div>
            {courseRegistrations.length === 0 ? (
              <div className='flex items-center justify-center flex-col gap-5 py-5 flex-1 bg-white'>
                <ScrollText className='text-muted-foreground h-24 w-24' />
                <div className='flex flex-col gap-1 justify-center items-center'>
                  <h3 className='text-primary font-semibold text-xl'>
                    No Registrations
                  </h3>
                  <p className='text-muted-foreground'>
                    There is no registrations available.
                  </p>
                </div>
              </div>
            ) : (
              <div className='flex flex-col w-full gap-3 bg-white border rounded-md'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className='whitespace-nowrap'>
                        Last Activity
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseRegistrations.map(
                      (
                        {
                          id,
                          parentEmail,
                          parentName,
                          course,
                          createdAt,
                          phoneNumber,
                        },
                        idx
                      ) => (
                        <TableRow key={id}>
                          <TableCell className='font-medium'>
                            {idx + 1}
                          </TableCell>
                          <TableCell className='whitespace-nowrap text-primary font-semibold'>
                            {parentName}
                          </TableCell>
                          <TableCell>{parentEmail}</TableCell>
                          <TableCell className='whitespace-nowrap'>
                            {phoneNumber}
                          </TableCell>
                          <TableCell className='whitespace-nowrap'>
                            {course.name}
                          </TableCell>
                          <TableCell className='whitespace-nowrap'>
                            {moment(createdAt).fromNow()}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className='flex flex-col gap-5'>
            <div className='flex justify-between items-center'>
              <h2 className='font-extrabold text-2xl'>
                Instructor Registration
              </h2>
              <Link
                href='/admin/registrations/instructors'
                className='text-primary-blue hover:underline text-sm font-medium'
              >
                View All
              </Link>
            </div>
            {instructorRegistrations.length === 0 ? (
              <div className='flex items-center justify-center flex-col gap-5 py-5 flex-1 bg-white'>
                <ScrollText className='text-muted-foreground h-24 w-24' />
                <div className='flex flex-col gap-1 justify-center items-center'>
                  <h3 className='text-primary font-semibold text-xl'>
                    No Registrations
                  </h3>
                  <p className='text-muted-foreground'>
                    There is no registrations available.
                  </p>
                </div>
              </div>
            ) : (
              <div className='flex flex-col w-full gap-3 bg-white border rounded-md'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead className='whitespace-nowrap'>
                        Last Activity
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {instructorRegistrations.map(
                      ({ id, email, phoneNumber, createdAt, name }, idx) => (
                        <TableRow key={id}>
                          <TableCell className='font-medium'>
                            {idx + 1}
                          </TableCell>
                          <TableCell className='whitespace-nowrap text-primary font-semibold'>
                            {name}
                          </TableCell>
                          <TableCell>{email}</TableCell>
                          <TableCell className='whitespace-nowrap'>
                            {phoneNumber}
                          </TableCell>
                          <TableCell className='whitespace-nowrap'>
                            {moment(createdAt).fromNow()}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className='flex flex-col gap-5'>
            <div className='flex justify-between items-center'>
              <h2 className='font-extrabold text-2xl'>
                Trial Class Registration
              </h2>
              <Link
                href='/admin/registrations/courses'
                className='text-primary-blue hover:underline text-sm font-medium'
              >
                View All
              </Link>
            </div>
            {trialClassRegistrations.length === 0 ? (
              <div className='flex items-center justify-center flex-col gap-5 py-5 flex-1 bg-white'>
                <ScrollText className='text-muted-foreground h-24 w-24' />
                <div className='flex flex-col gap-1 justify-center items-center'>
                  <h3 className='text-primary font-semibold text-xl'>
                    No Registrations
                  </h3>
                  <p className='text-muted-foreground'>
                    There is no registrations available.
                  </p>
                </div>
              </div>
            ) : (
              <div className='flex flex-col w-full gap-3 bg-white border rounded-md'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead className='whitespace-nowrap'>
                        Last Activity
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trialClassRegistrations.map(
                      (
                        {
                          id,
                          email,
                          parentName,
                          course,
                          createdAt,
                          phoneNumber,
                        },
                        idx
                      ) => (
                        <TableRow key={id}>
                          <TableCell className='font-medium'>
                            {idx + 1}
                          </TableCell>
                          <TableCell className='whitespace-nowrap text-primary font-semibold'>
                            {parentName}
                          </TableCell>
                          <TableCell>{email}</TableCell>
                          <TableCell className='whitespace-nowrap'>
                            {phoneNumber}
                          </TableCell>
                          <TableCell className='whitespace-nowrap'>
                            {course.name}
                          </TableCell>
                          <TableCell className='whitespace-nowrap'>
                            {moment(createdAt).fromNow()}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
        <div className='w-full md:w-1/3'>
          <div className='bg-white rounded-md shadow-sm'>
            <Image
              src='/dashboard-banner.jpg'
              className='w-full h-32 rounded-t-md'
              height={160}
              width={320}
              alt='Profile Banner'
            />
            <div className='flex flex-col gap-5 px-5 relative -top-10'>
              <div className='rounded-md p-2 shadow-md bg-white w-fit'>
                <Image
                  src={
                    accountDetail.image ||
                    session.user.image ||
                    '/avatar-fallback.svg'
                  }
                  alt={accountDetail.name}
                  width={64}
                  height={64}
                  className='h-16 w-16 rounded-md'
                />
              </div>

              <div className='flex flex-col gap-2'>
                <h3 className='text-base font-bold'>{accountDetail.name}</h3>
                <div className='flex gap-2 items-center'>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                  <p className='text-muted-foreground text-sm'>
                    {accountDetail.email}
                  </p>
                </div>
                <Button
                  variant='primary-blue-outline'
                  size='xs'
                  className='rounded-full font-semibold leading-3 mt-1'
                  asChild
                >
                  <Link href={`/profile/${session.user.id}/edit`}>
                    Edit profile
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

import { getCurrentUser } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

import Link from 'next/link';
import {
  ArrowLeft,
  BarChart,
  BookCheck,
  LayoutDashboard,
  ListTodo,
  Shapes,
  Wrench,
} from 'lucide-react';
import IconBadge from '@/components/shared/IconBadge';
import CourseNameForm from './_components/CourseNameForm';
import CourseDescriptionForm from './_components/CourseDescriptionForm';
import CourseCategory from './_components/CourseCategoryForm';
import { fetchCategories } from '@/lib/actions/category.actions';
import SessionsForm from './_components/SessionsForm';
import { fetchCourseById } from '@/lib/actions/program.actions';
import Banner from '@/components/shared/Banner';
import CourseActions from './_components/CourseActions';
import CourseProgrammingToolsForm from './_components/CourseProgrammingToolsForm';
import CourseLevelForm from './_components/CourseLevelForm';
import CourseImageForm from './_components/CourseImageForm';
import CourseCodeForm from './_components/CourseCodeForm';
import EvaluationsList from './_components/EvaluationsList';

const Page = async ({
  params: { programId, courseId },
}: {
  params: {
    programId: string;
    courseId: string;
  };
}) => {
  const session = await getCurrentUser();
  if (!session) return redirect('/');

  const course = await fetchCourseById({ courseId, programId });

  if (!course) return notFound();

  const categories = await fetchCategories();

  const options = categories.map(({ id, name, ageDescription }) => ({
    label: `${name} (${ageDescription})`,
    value: id,
  }));

  const requiredFields = [
    course.name,
    course.description,
    course.categoryId,
    course.level,
    course.programmingTools,
    course.sessions.some((session) => session.isPublished),
    course.evaluations.length,
  ];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && <Banner label='This course is a draft' />}
      <div className='container max-w-7xl p-0'>
        <div className='flex items-center justify-between'>
          <div className='w-full'>
            <Link
              href={`/admin/programs/${programId}`}
              className='flex items-center text-sm hover:opacity-75 transition mb-6'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </Link>
            <div className='flex items-center justify-between w-full'>
              <div className='flex flex-col gap-y-2'>
                <h1 className='text-2xl font-medium'>Course Setup</h1>
                <span className='text-sm text-slate-700'>
                  Complete all fields {completionText}
                </span>
              </div>
              <CourseActions disabled={!isComplete} course={course} />
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div className='space-y-4'>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={LayoutDashboard} />
                <h2 className='text-xl'>Customize course</h2>
              </div>
              <CourseImageForm initialData={course} />
              <CourseNameForm initialData={course} />
              <CourseDescriptionForm initialData={course} />
              <CourseCodeForm initialData={course} />
              <div className='mt-6'>
                <div className='flex items-center gap-x-2'>
                  <IconBadge icon={BarChart} />
                  <h2 className='text-xl'>Course Level</h2>
                </div>
                <CourseLevelForm initialData={course} />
              </div>
              <div className='mt-6'>
                <div className='flex items-center gap-x-2'>
                  <IconBadge icon={Shapes} />
                  <h2 className='text-xl'>Course Category</h2>
                </div>
                <CourseCategory initialData={course} options={options} />
              </div>
              <div className='mt-6'>
                <div className='flex items-center gap-x-2'>
                  <IconBadge icon={Wrench} />
                  <h2 className='text-xl'>Programming Tools</h2>
                </div>
                <CourseProgrammingToolsForm initialData={course} />
              </div>
            </div>
          </div>
          <div className='space-y-6'>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={ListTodo} />
                <h2 className='text-xl'>Sessions</h2>
              </div>
              <SessionsForm initialData={course} />
            </div>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={BookCheck} />
                <h2 className='text-xl'>Course Evaluation</h2>
              </div>
              <EvaluationsList evaluations={course.evaluations} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;

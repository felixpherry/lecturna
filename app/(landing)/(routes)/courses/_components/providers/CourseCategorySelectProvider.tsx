import { db } from '@/lib/db';
import CourseCategorySelect from '../CourseCategorySelect';

const CourseCategorySelectProvider = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      ageDescription: 'asc',
    },
  });
  return <CourseCategorySelect categories={categories} />;
};

export default CourseCategorySelectProvider;

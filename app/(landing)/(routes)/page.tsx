import About from '@/app/(landing)/_components/About';
import Programs from '@/app/(landing)/_components/Programs';
import Testimonials from '@/app/(landing)/_components/Testimonials';
import WhatsAppWidget from '@/app/(landing)/_components/WhatsAppWidget';
import Faq from '@/components/layouts/Faq';
import Hero from '@/components/layouts/Hero';
import { fetchFaq } from '@/lib/actions/faq.actions';
import { fetchHero } from '@/lib/actions/hero.actions';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { SessionInterface } from '@/types';

export default async function Home({
  searchParams: { category },
}: {
  searchParams: { category?: string };
}) {
  const session = (await getCurrentUser()) as SessionInterface;
  const hero = await fetchHero();

  const faq = await fetchFaq();

  const programs = await db.program.findMany({
    where: {
      isPublished: true,
      isDeleted: false,
      courses: {
        some: {
          categoryId: category,
        },
      },
    },
    include: {
      _count: {
        select: {
          courses: {
            where: {
              isPublished: true,
              isDeleted: false,
              categoryId: category,
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <Hero
        session={session}
        title={hero?.title || ''}
        subtitle={hero?.subtitle || ''}
        image={hero?.image || ''}
      />
      <About />
      <Programs programs={programs} />
      <Testimonials />
      <Faq faq={faq} />
      <WhatsAppWidget />
    </div>
  );
}

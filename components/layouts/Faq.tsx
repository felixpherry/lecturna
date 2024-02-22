'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

interface FaqProps {
  faq: {
    id: string;
    question: string;
    answer: string;
  }[];
}

const Faq = ({ faq }: FaqProps) => {
  return (
    <div className='bg-white w-full px-4 py-20 md:px-10'>
      <h1 className='mb-12 text-4xl text-center font-bold tracking-tight leading-none'>
        Frequently Asked Questions
      </h1>
      <Accordion type='multiple' className='w-full px-10 max-w-7xl mx-auto'>
        {faq.map(({ question, answer, id }) => (
          <AccordionItem key={id} value={id} className='py-4'>
            <AccordionTrigger className='text-left text-sm font-bold text-slate-600 md:text-lg hover:no-underline'>
              {question}
            </AccordionTrigger>
            <AccordionContent className='text-base'>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Faq;

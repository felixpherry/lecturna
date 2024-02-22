'use client';

import Carousel, { ResponsiveType } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { ArrowRight, ArrowLeft } from 'lucide-react';

import { testimonials } from '@/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';

import { Rating } from '@smastrom/react-rating';
import { Button } from '../../../components/ui/button';

const ButtonGroup = ({
  next,
  previous,
}: {
  next?: () => void;
  previous?: () => void;
}) => {
  return (
    <div className='flex justify-end gap-3 mt-10 mr-10'>
      <Button
        variant='primary-blue'
        className='rounded-full p-3'
        onClick={previous}
      >
        <ArrowLeft />
      </Button>
      <Button
        variant='primary-blue'
        className='rounded-full p-3'
        onClick={next}
      >
        <ArrowRight />
      </Button>
    </div>
  );
};

const responsive: ResponsiveType = {
  0: {
    breakpoint: { max: 2048, min: 1024 },
    items: 2,
    slidesToSlide: 2,
  },
  1: {
    breakpoint: { max: 768, min: 1024 },
    items: 2,
    slidesToSlide: 2,
  },
  2: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const Testimonials = () => {
  return (
    <div className='bg-light-white w-full py-20 px-5'>
      <h1 className='mb-20 text-4xl text-center font-bold tracking-tight leading-none'>
        Testimonial
      </h1>
      <div className='container max-w-7xl'>
        <Carousel
          responsive={responsive}
          infinite={true}
          partialVisible={true}
          customButtonGroup={<ButtonGroup />}
          renderButtonGroupOutside={true}
          arrows={false}
          ssr={true}
        >
          {testimonials.map(({ name, content, rating }) => (
            <Card
              key={name}
              className='w-full h-full max-w-[330px] md:max-w-[480px] shadow-lg rounded-xl border-2 border-light-white-500 mx-4 my-auto flex justify-between flex-col p-10'
            >
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>
                  <Rating style={{ maxWidth: 100 }} value={rating} readOnly />
                </CardDescription>
              </CardHeader>
              <CardContent className='text-lg md:text-xl font-semibold'>
                &quot;{content}&quot;
              </CardContent>
            </Card>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Testimonials;

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CourseFormSidebarProps {
  steps: string[];
  currentStep: number;
}

const CourseFormStepper = ({ steps, currentStep }: CourseFormSidebarProps) => {
  return (
    <Card className='h-fit p-8 shadow bg-gradient-to-l from-[#273575] to-[#004AAD] text-white'>
      <CardContent className='flex flex-col gap-6'>
        {steps.map((step, idx) => (
          <div key={idx} className='flex gap-3 items-center'>
            <span
              className={cn(
                'p-3 rounded-full flex items-center justify-center w-10 h-10 font-bold',
                currentStep === idx + 1
                  ? 'bg-sky-200 text-primary-blue'
                  : 'border-white border-1'
              )}
            >
              {idx + 1}
            </span>
            <div className='flex flex-col'>
              <h3 className='text-light-white-200 font-medium uppercase'>
                Step {idx + 1}
              </h3>
              <p className='uppercase font-bold'>{step}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CourseFormStepper;

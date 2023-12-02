import { motion } from 'framer-motion';
import Link from 'next/link';
import { Step } from './types';
import { cn } from '@/lib/utils';

type StepsProps = {
  currentStep: Step;
};

const StepOverview = ({ currentStep }: StepsProps) => {
  const steps: { title: string; step: Step; description: string }[] = [
    {
      title: 'Info',
      step: 'info',
      description: 'Enter the title, description, and tags for your auction.',
    },
    {
      title: 'Media',
      step: 'media',
      description: 'Upload images for your auction.',
    },
    {
      title: 'End Date',
      step: 'time',
      description: 'Set the end time for your auction.',
    },
    {
      title: 'Summary',
      step: 'summary',
      description: 'Review your auction details and submit.',
    },
  ];

  return (
    <div className='flex flex-col gap-2 bg-accent-950 p-4'>
      <ul>
        {steps.map(({ title, step }, i) => (
          <li
            key={title}
            className={cn(
              'relative whitespace-nowrap text-lg',
              currentStep === step && 'font-bold',
            )}
          >
            {currentStep === step && (
              <motion.span
                layout
                layoutId='step-indicator'
                className='absolute -left-3 top-2 h-2 w-2 rounded-full bg-accent-500'
              />
            )}
            <Link href={`?step=${step}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StepOverview;

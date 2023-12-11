import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Step } from './types';

type StepsProps = {
  currentStep: Step;
  steps: { title: string; step: Step; description: string }[];
};

const StepOverview = ({ currentStep, steps }: StepsProps) => {
  return (
    <ul className='flex justify-between gap-2 rounded-lg bg-accent-950 p-2 px-4 sm:flex-col sm:justify-start sm:p-4'>
      {steps.map(({ title, step }) => (
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
              className='absolute -bottom-1 left-1/2 h-2 w-2 rounded-full bg-accent-500 sm:-left-3 sm:top-2'
            />
          )}
          <span>{title}</span>
        </li>
      ))}
    </ul>
  );
};

export default StepOverview;

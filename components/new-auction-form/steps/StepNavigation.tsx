import { Button } from '@/components/ui/button';
import { Step } from '../types';

type Props = {
  prevStep: () => void;
  currentStep: Step;
  disabled?: boolean;
  prevBtnLabel?: string;
  nextBtnLabel?: string;
};
const StepNavigation = ({
  prevStep,
  currentStep,
  disabled,
  prevBtnLabel,
  nextBtnLabel,
}: Props) => {
  return (
    <div className='flex w-full justify-end gap-4'>
      <Button variant='outline' type='button' onClick={prevStep}>
        {prevBtnLabel || 'Back'}
      </Button>
      <Button variant='accent' type='submit' disabled={disabled}>
        {nextBtnLabel || 'Next'}
      </Button>
    </div>
  );
};

export default StepNavigation;

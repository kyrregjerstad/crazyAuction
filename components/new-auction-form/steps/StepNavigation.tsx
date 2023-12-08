import { Button } from '@/components/ui/button';
import { Step } from '../types';

type Props = {
  nextStep: () => void;
  prevStep: () => void;
  currentStep: Step;
  disabled?: boolean;
};
const StepNavigation = ({
  nextStep,
  prevStep,
  currentStep,
  disabled,
}: Props) => {
  return (
    <div className='flex w-full justify-end gap-4'>
      <Button variant='outline' type='button' onClick={prevStep}>
        {currentStep === 'info' ? 'Cancel' : 'Back'}
      </Button>
      <Button variant='accent' type='submit' disabled={disabled}>
        {currentStep === 'summary' ? 'Submit' : 'Next'}
      </Button>
    </div>
  );
};

export default StepNavigation;

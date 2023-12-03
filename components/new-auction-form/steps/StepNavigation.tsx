import { Button } from '@/components/ui/button';
import useAuctionFormStep from '@/lib/hooks/useAuctionFormStep';

type Props = {
  disabled?: boolean;
};
const StepNavigation = ({ disabled }: Props) => {
  const { nextStep, prevStep, getCurrentStep } = useAuctionFormStep();

  const currentStep = getCurrentStep();

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

import { Button } from '@/components/ui/button';
import useAuctionFormStep from '@/lib/hooks/useAuctionFormStep';
import React from 'react';
import { useAuctionFormContext } from './AuctionFormContext';

const StepNavigation = () => {
  const { nextStep, prevStep, getCurrentStep } = useAuctionFormStep();
  const { allImagesUploaded } = useAuctionFormContext();

  const currentStep = getCurrentStep();

  return (
    <div className='flex w-full justify-end gap-4'>
      <Button variant='outline' type='button' onClick={prevStep}>
        {currentStep === 'info' ? 'Cancel' : 'Back'}
      </Button>
      <Button
        variant='accent'
        type='submit'
        onClick={nextStep}
        disabled={currentStep === 'media' && !allImagesUploaded}
      >
        {currentStep === 'summary' ? 'Submit' : 'Next'}
      </Button>
    </div>
  );
};

export default StepNavigation;

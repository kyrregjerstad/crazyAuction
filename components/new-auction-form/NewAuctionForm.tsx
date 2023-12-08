'use client';

import useAuctionFormStep from '@/lib/hooks/useAuctionFormStep';
import { Card } from '../ui/card';
import StepOverview from './StepOverview';
import {
  DateStepForm,
  InfoStepForm,
  MediaStepForm,
  SummaryStepForm,
} from './steps';
import { AuctionForm } from './types';
import postListing from '@/lib/services/postListing';
import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';

const NewAuctionForm = ({ mode = 'create', listing }: AuctionForm) => {
  const { getCurrentStep, nextStep, prevStep } = useAuctionFormStep();
  const { getStore, updateStore, clearStore } = useAuctionFormStore();
  const currentStep = getCurrentStep();

  const props = {
    mode,
    listing,
    currentStep,
    getStore,
    clearStore,
    updateStore,
    nextStep,
    prevStep,
    postListing,
  };

  const RenderStep = () => {
    switch (currentStep) {
      case 'info':
        return <InfoStepForm {...props} />;
      case 'media':
        return <MediaStepForm {...props} />;
      case 'time':
        return <DateStepForm {...props} />;
      case 'summary':
        return <SummaryStepForm {...props} />;
      default:
        return <InfoStepForm {...props} />;
    }
  };

  return (
    <Card className='flex w-full max-w-2xl gap-5 p-4'>
      <StepOverview currentStep={currentStep} />
      <div className='flex w-full flex-col gap-4'>
        <RenderStep />
      </div>
    </Card>
  );
};

export default NewAuctionForm;

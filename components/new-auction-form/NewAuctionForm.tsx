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
import { NewAuctionFormProps } from './types';

const NewAuctionForm = ({ mode = 'create', listing }: NewAuctionFormProps) => {
  const { getCurrentStep } = useAuctionFormStep();
  const currentStep = getCurrentStep();

  const RenderStep = () => {
    switch (currentStep) {
      case 'info':
        return <InfoStepForm mode={mode} listing={listing} />;
      case 'media':
        return <MediaStepForm mode={mode} listing={listing} />;
      case 'time':
        return <DateStepForm mode={mode} listing={listing} />;
      case 'summary':
        return <SummaryStepForm />;
      default:
        return <InfoStepForm mode={mode} listing={listing} />;
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

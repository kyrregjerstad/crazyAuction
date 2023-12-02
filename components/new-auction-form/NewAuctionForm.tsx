'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '../ui/card';
import {
  DateStepForm,
  InfoStepForm,
  MediaStepForm,
  SummaryStepForm,
} from './steps';
import StepOverview from './StepOverview';
import { NewAuctionFormProps, Step, validSteps } from './types';

const NewAuctionForm = ({ mode = 'create', listing }: NewAuctionFormProps) => {
  const searchParams = useSearchParams();
  let currentStep = searchParams.get('step') as Step | undefined;

  if (!currentStep || !validSteps.includes(currentStep)) {
    currentStep = 'info';
  }

  const renderStep = () => {
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
    <>
      <Card className='flex w-full max-w-xl gap-5 p-4'>
        <StepOverview currentStep={currentStep} />
        <div className='flex w-full flex-col gap-4'>{renderStep()}</div>
      </Card>
      {/* <NewAuctionImageGallery images={images} setValue={setValue} /> */}
    </>
  );
};

export default NewAuctionForm;

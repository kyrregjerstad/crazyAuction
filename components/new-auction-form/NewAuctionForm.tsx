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
import StepNavigation from './StepNavigation';
import { PropsWithChildren } from 'react';

const NewAuctionForm = ({ mode = 'create', listing }: NewAuctionFormProps) => {
  const searchParams = useSearchParams();
  let currentStep = searchParams.get('step') as Step | undefined;

  if (!currentStep || !validSteps.includes(currentStep)) {
    currentStep = 'info';
  }

  const RenderStep = ({ children }: PropsWithChildren) => {
    switch (currentStep) {
      case 'info':
        return (
          <InfoStepForm mode={mode} listing={listing}>
            {children}
          </InfoStepForm>
        );
      case 'media':
        return (
          <MediaStepForm mode={mode} listing={listing}>
            {children}
          </MediaStepForm>
        );
      case 'time':
        return (
          <DateStepForm mode={mode} listing={listing}>
            {children}
          </DateStepForm>
        );
      case 'summary':
        return <SummaryStepForm> {children} </SummaryStepForm>;
      default:
        return (
          <InfoStepForm mode={mode} listing={listing}>
            {children}
          </InfoStepForm>
        );
    }
  };

  return (
    <>
      <Card className='flex w-full max-w-xl gap-5 p-4'>
        <StepOverview currentStep={currentStep} />
        <div className='flex w-full flex-col gap-4'>
          <RenderStep>
            <StepNavigation />
          </RenderStep>
        </div>
      </Card>
      {/* <NewAuctionImageGallery images={images} setValue={setValue} /> */}
    </>
  );
};

export default NewAuctionForm;

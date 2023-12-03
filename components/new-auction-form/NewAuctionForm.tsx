'use client';

import { useSearchParams } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { Card } from '../ui/card';
import { AuctionFormContextProvider } from './AuctionFormContext';
import StepNavigation from './StepNavigation';
import StepOverview from './StepOverview';
import {
  DateStepForm,
  InfoStepForm,
  MediaStepForm,
  SummaryStepForm,
} from './steps';
import { NewAuctionFormProps, Step, validSteps } from './types';

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
    <AuctionFormContextProvider>
      <Card className='flex w-full max-w-xl gap-5 p-4'>
        <StepOverview currentStep={currentStep} />
        <div className='flex w-full flex-col gap-4'>
          <RenderStep>
            <StepNavigation />
          </RenderStep>
        </div>
      </Card>
    </AuctionFormContextProvider>
  );
};

export default NewAuctionForm;

'use client';

import { useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import StepOverview from './StepOverview';
import { postAuction, updateAuction } from '@/lib/services/auction-api';
import useAuctionFormStep from '@/lib/hooks/useAuctionFormStep';
import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';
import { AuctionFull } from '@/lib/schemas';
import { AuctionForm, FormStepProps } from './types';

import { Card } from '../ui/card';
import {
  DateStepForm,
  InfoStepForm,
  MediaStepForm,
  SummaryStepForm,
} from './steps';
import { useStore } from 'zustand';

const AuctionForm = ({ mode = 'create', listing }: AuctionForm) => {
  const { getCurrentStep, nextStep, prevStep, steps } = useAuctionFormStep({
    mode,
  });
  const { getStore, updateStore, clearStore } = useAuctionFormStore();

  const auctionFormData = useStore(useAuctionFormStore, (state) =>
    state.getStore(),
  ); // this is an extra store wrapper around the zustand store to fix the hydration issue

  const currentStep = getCurrentStep();

  useEffect(() => {
    const normalizedListing = transformListingToStore(listing);
    if (!normalizedListing) {
      return;
    }

    if (!isEqual(normalizedListing, auctionFormData)) {
      clearStore();
      updateStore(normalizedListing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // we only want to run this once when the component mounts, to clear the store

  const props = {
    mode,
    listing,
    currentStep,
    getStore,
    clearStore,
    updateStore,
    storedData: auctionFormData,
    nextStep,
    prevStep,
    postListing: postAuction,
    updateAuction,
  } satisfies FormStepProps;

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
    <Card className='flex min-h-[85dvh] w-full max-w-2xl flex-col gap-5 p-4 xs:p-8 sm:h-[450px] sm:min-h-[500px] sm:flex-row sm:p-4'>
      <StepOverview currentStep={currentStep} steps={steps} />
      <div className='flex h-full w-full flex-1 flex-col items-stretch'>
        <RenderStep />
      </div>
    </Card>
  );
};

export default AuctionForm;

const transformListingToStore = (listing: AuctionFull | null) => {
  if (!listing) {
    return null;
  }
  return {
    title: listing.title,
    description: listing.description,
    tags: listing.tags,
    imageUrls: listing.media,
    id: listing.id,
    dateTime: listing.endsAt,
  };
};

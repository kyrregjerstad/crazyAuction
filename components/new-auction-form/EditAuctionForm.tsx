'use client';

import useAuctionFormStep from '@/lib/hooks/useAuctionFormStep';
import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';
import { ListingFull } from '@/lib/schemas/listingSchema';
import postListing from '@/lib/services/postListing';
import { useEffect } from 'react';
import { Card } from '../ui/card';
import StepOverview from './StepOverview';
import {
  DateStepForm,
  InfoStepForm,
  MediaStepForm,
  SummaryStepForm,
} from './steps';
import { FormStepProps } from './types';
import { isEqual } from 'lodash';

type EditAuctionFormProps = {
  listing: ListingFull | null;
};

const EditAuctionForm = ({ listing }: EditAuctionFormProps) => {
  const { getCurrentStep, nextStep, prevStep } = useAuctionFormStep({
    mode: 'edit',
  });
  const { getStore, updateStore, clearStore, storedData } =
    useAuctionFormStore();
  const currentStep = getCurrentStep();

  useEffect(() => {
    const normalizedListing = transformListingToStore(listing);
    if (!normalizedListing) {
      return;
    }

    if (!isEqual(normalizedListing, storedData)) {
      clearStore();
      updateStore(normalizedListing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // we only want to run this once when the component mounts, to clear the store

  const props = {
    listing,
    currentStep,
    getStore,
    clearStore,
    updateStore,
    nextStep,
    prevStep,
    postListing,
    id: listing?.id,
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
    <Card className='flex w-full max-w-2xl flex-col gap-5 p-4 sm:flex-row'>
      <StepOverview currentStep={currentStep} />
      <div className='flex w-full flex-col gap-4'>
        <RenderStep />
      </div>
    </Card>
  );
};

export default EditAuctionForm;

const transformListingToStore = (listing: ListingFull | null) => {
  if (!listing) {
    return null;
  }
  return {
    title: listing.title,
    description: listing.description,
    tags: listing.tags,
    imageUrls: listing.media,
    dateTime: listing.endsAt,
  };
};

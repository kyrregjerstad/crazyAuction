'use client';

import {
  AuctionFormComplete,
  auctionFormSchemaComplete,
} from '@/lib/schemas/auctionSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Image from '../../Image';
import { FormStepProps } from '../types';
import StepNavigation from './StepNavigation';
import {
  UpdateAuctionForm,
  updateAuctionSchema,
} from '@/lib/schemas/updateAuctionSchema';

const SummaryStepForm = (props: FormStepProps) => {
  const {
    currentStep,
    prevStep,
    mode,
    storedData,
    postListing,
    updateAuction,
    clearStore,
  } = props;
  const router = useRouter();

  const onSaveSummaryStep = async () => {
    const formData = storedData as AuctionFormComplete;
    const res = await postListing({ formData });
    router.push(`/item/${res?.id}`);
    clearStore();
  };

  const onUpdateAuction = async () => {
    const formData = storedData as AuctionFormComplete;
    const transformedFormData = {
      title: formData.title || undefined,
      description: formData.description || undefined,
      imageUrls: formData.imageUrls || undefined,
      tags: formData.tags || undefined,
    } satisfies UpdateAuctionForm;

    const auctionId = storedData?.id;

    if (!auctionId) {
      console.error('No auction id provided');
      return;
    }

    const res = await updateAuction({
      formData: transformedFormData,
      id: auctionId,
    });

    clearStore();
    router.refresh();
    router.push(`/item/${res?.id}`);
  };

  const summaryFormCreate = useForm({
    resolver: zodResolver(auctionFormSchemaComplete),
    defaultValues: {
      title: storedData?.title ?? '',
      description: storedData?.description ?? '',
      tags: storedData?.tags ?? [],
      dateTime: storedData?.dateTime ?? '',
      imageUrls: storedData?.imageUrls ?? [],
    },
  });

  const summaryFormEdit = useForm({
    resolver: zodResolver(updateAuctionSchema),
    defaultValues: storedData,
  });

  const {
    formState: { isSubmitting: isSubmittingCreate },
    handleSubmit: handleSubmitCreate,
  } = summaryFormCreate;

  const {
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
    handleSubmit: handleSubmitEdit,
  } = summaryFormEdit;

  return (
    <>
      {mode === 'create' ? (
        <form
          className='flex h-full flex-1 flex-col justify-between gap-4'
          onSubmit={handleSubmitCreate(onSaveSummaryStep)}
        >
          <SummaryContent auctionFormData={storedData} mode={mode} />
          <StepNavigation
            disabled={isSubmittingCreate}
            currentStep={currentStep}
            prevStep={prevStep}
            nextBtnLabel='Submit'
          />
        </form>
      ) : (
        <form
          className='flex h-full flex-col justify-between gap-4'
          onSubmit={handleSubmitEdit(onUpdateAuction)}
        >
          <SummaryContent auctionFormData={storedData} mode='edit' />
          <StepNavigation
            disabled={isSubmittingEdit}
            currentStep={currentStep}
            prevStep={prevStep}
            nextBtnLabel='Update'
          />
        </form>
      )}
    </>
  );
};

export default SummaryStepForm;

type SummaryContentProps = {
  auctionFormData?: Partial<AuctionFormComplete>;
  mode: 'create' | 'edit';
};
const SummaryContent = ({ auctionFormData, mode }: SummaryContentProps) => (
  <>
    <div className='flex flex-col gap-4 sm:flex-row sm:gap-8'>
      <div className='flex w-full flex-col gap-2 sm:gap-8'>
        <div className='flex flex-col'>
          <span className='text-sm'>Title</span>
          <span className='rounded-md bg-foreground p-2 text-background'>
            {auctionFormData?.title ? (
              auctionFormData?.title
            ) : (
              <span className='text-neutral-400'>No title</span>
            )}
          </span>
        </div>
        <div className='flex flex-1 flex-col'>
          <span className='text-sm'>Description</span>
          <span className='h-full rounded-md bg-foreground p-2 text-background'>
            {auctionFormData?.description ? (
              auctionFormData?.description
            ) : (
              <span className='text-neutral-400'>No description</span>
            )}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='text-sm'>Tags</span>
          <span className='min-h-[40px] rounded-md bg-foreground p-2 text-background'>
            {auctionFormData?.tags && auctionFormData.tags.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {auctionFormData?.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-md bg-neutral-200 p-2 text-neutral-800'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <span className='text-neutral-400'>No tags</span>
            )}
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-2 sm:gap-8'>
        <div className='flex gap-2'>
          <div className='flex flex-1 flex-col'>
            <span className='text-sm'>Date</span>
            <span className='flex-1 rounded-md bg-foreground p-2 text-background'>
              {auctionFormData?.dateTime ? (
                <span className={'text-neutral-500'}>
                  {dayjs(auctionFormData.dateTime).format('DD/MM/YYYY')}
                </span>
              ) : (
                <span className='text-neutral-400'>No date</span>
              )}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-sm'>Time</span>
            <span className='rounded-md bg-foreground p-2 pr-12 text-background'>
              {auctionFormData?.dateTime ? (
                <span className={'text-neutral-500'}>
                  {dayjs(auctionFormData.dateTime).format('HH:mm')}
                </span>
              ) : (
                <span className='text-neutral-400'>No time</span>
              )}
            </span>
          </div>
        </div>
        <div className='flex flex-col'>
          <span className='text-sm'>Images</span>
          <div className='flex flex-col rounded-md bg-foreground p-2'>
            {auctionFormData?.imageUrls &&
            auctionFormData.imageUrls.length > 0 ? (
              <>
                <div className='grid grid-cols-3 gap-2'>
                  {auctionFormData?.imageUrls.map((image) => (
                    <Image
                      key={image}
                      src={image}
                      width={100}
                      height={100}
                      alt='image'
                      className='aspect-square rounded-md border border-neutral-200 object-cover'
                    />
                  ))}
                </div>
              </>
            ) : (
              <span className='text-neutral-400'>No images</span>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
);

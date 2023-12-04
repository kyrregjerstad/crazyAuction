'use client';

import useMultiStepAuctionForm from '@/lib/hooks/forms/useMultiStepForm';
import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';
import useStore from '@/lib/hooks/useStore';
import { Label } from '@radix-ui/react-dropdown-menu';
import Image from '../../Image';
import StepNavigation from './StepNavigation';

const SummaryStepForm = () => {
  const { summary, saveStep } = useMultiStepAuctionForm({
    mode: 'create',
    listing: null,
    step: 'summary',
  });

  const auctionFormData = useStore(useAuctionFormStore, (state) =>
    state.getStore(),
  );

  const formState = auctionFormData;

  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
    setValue,
    getValues,
  } = summary;

  return (
    <form className='flex flex-col gap-4' onSubmit={saveStep}>
      <div className='flex gap-4'>
        <div className='flex w-full flex-col gap-2'>
          <div className='flex flex-col'>
            <span className='text-sm'>Title</span>
            <span className='rounded-md bg-foreground p-2 text-background'>
              {formState?.title}
            </span>
          </div>
          <div className='flex flex-1 flex-col'>
            <span className='text-sm'>Description</span>
            <span className='h-full rounded-md bg-foreground p-2 text-background'>
              {formState?.description}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-sm'>Tags</span>
            <span className='min-h-[40px] rounded-md bg-foreground p-2 text-background'>
              {formState?.tags ? (
                <>{formState?.tags}</>
              ) : (
                <span className='text-neutral-400'>No tags</span>
              )}
            </span>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-2'>
            <div className='flex flex-1 flex-col'>
              <span className='text-sm'>Date</span>
              <span className='flex-1 rounded-md bg-foreground p-2 text-background'>
                {formState?.dateTime?.toLocaleDateString?.() || ''}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>Time</span>
              <span className='rounded-md bg-foreground p-2 pr-12 text-background'>
                {formState?.dateTime?.toLocaleTimeString?.([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }) || ''}
              </span>
            </div>
          </div>
          <div className='flex flex-col'>
            <span className='text-sm'>Images</span>
            <div className='flex flex-col rounded-md bg-foreground p-2'>
              {formState?.imageUrls && formState.imageUrls.length > 0 && (
                <>
                  <div className='grid grid-cols-3 gap-2'>
                    {formState?.imageUrls.map((image) => (
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
              )}
            </div>
          </div>
        </div>
      </div>
      <StepNavigation />
      <input
        type='text'
        readOnly
        name='title'
        id='title'
        value={formState?.title}
        className='hidden'
      />
      <input
        type='text'
        readOnly
        name='description'
        id='description'
        value={formState?.description}
        className='hidden'
      />
      <input
        type='text'
        readOnly
        name='tags'
        id='tags'
        value={formState?.tags}
        className='hidden'
      />
      <input
        type='text'
        readOnly
        name='imageUrls'
        id='imageUrls'
        value={formState?.imageUrls}
        className='hidden'
      />
      <input
        type='text'
        readOnly
        name='dateTime'
        id='dateTime'
        value={formState?.dateTime?.toISOString?.()}
        className='hidden'
      />

      {/* <Debugger json={JSON.stringify(formState, null, 2)} /> */}
    </form>
  );
};

export default SummaryStepForm;

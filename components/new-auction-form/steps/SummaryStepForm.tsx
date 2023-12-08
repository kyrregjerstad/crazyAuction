'use client';

import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useMultiStepAuctionForm from '@/lib/hooks/forms/useMultiStepForm';
import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';
import useStore from '@/lib/hooks/useStore';
import dayjs from 'dayjs';
import Image from '../../Image';
import { FormStepProps } from '../types';
import StepNavigation from './StepNavigation';

const SummaryStepForm = (props: FormStepProps) => {
  const { currentStep, nextStep, prevStep } = props;

  const { summary, saveStep } = useMultiStepAuctionForm(props);

  const auctionFormData = useStore(useAuctionFormStore, (state) =>
    state.getStore(),
  );

  const formState = auctionFormData;

  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful, errors },
    setValue,
    getValues,
  } = summary;

  return (
    <Form {...summary}>
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
                  {formState?.dateTime
                    ? dayjs(formState.dateTime).format('DD/MM/YYYY')
                    : ''}
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm'>Time</span>
                <span className='rounded-md bg-foreground p-2 pr-12 text-background'>
                  {formState?.dateTime
                    ? dayjs(formState.dateTime).format('HH:mm')
                    : ''}
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
        <StepNavigation
          disabled={isSubmitting}
          currentStep={currentStep}
          prevStep={prevStep}
        />
        <div className='hidden'>
          <FormField
            control={control}
            name='title'
            render={({ field }) => <Input {...field} readOnly />}
          />
          <FormField
            control={control}
            name='description'
            render={({ field }) => <Input {...field} readOnly />}
          />
          <FormField
            control={control}
            name='tags'
            render={({ field }) => <Input {...field} readOnly />}
          />
          <FormField
            control={control}
            name='dateTime'
            render={({ field }) => <Input {...field} readOnly />}
          />
          <FormField
            control={control}
            name='imageUrls'
            render={({ field }) => <Input {...field} readOnly />}
          />
        </div>

        {/* <Debugger json={JSON.stringify(formState, null, 2)} /> */}
      </form>
    </Form>
  );
};

export default SummaryStepForm;

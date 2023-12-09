'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import useMultiStepAuctionForm from '@/lib/hooks/forms/useMultiStepForm';
import { FormStepProps } from '../types';
import StepNavigation from './StepNavigation';
import { ChangeEvent, ChangeEventHandler } from 'react';

const InfoStepForm = (props: FormStepProps) => {
  const { currentStep, nextStep, prevStep } = props;
  const { info, saveStep } = useMultiStepAuctionForm(props);
  const { control, formState, setValue } = info;

  const { isDirty, isSubmitting, isValid } = formState;

  const handleTagsChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Transform the input value into an array
    const tags = event.target.value.split(',').map((tag) => tag.trim());
    // Update the form control with the new array
    setValue('tags', tags, { shouldValidate: true });
  };

  return (
    <Form {...info}>
      <form className='flex w-full max-w-lg flex-col gap-5' onSubmit={saveStep}>
        <FormField
          control={control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder='Title'
                  {...field}
                  className='bg-foreground text-background'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Description'
                  maxLength={250}
                  {...field}
                  value={field.value || ''}
                  className='bg-foreground text-background'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder='Tags'
                  {...field}
                  onChange={handleTagsChange}
                  className='bg-foreground text-background'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepNavigation
          disabled={isSubmitting}
          currentStep={currentStep}
          prevStep={prevStep}
          prevBtnLabel='Cancel'
        />
      </form>
    </Form>
  );
};

export default InfoStepForm;

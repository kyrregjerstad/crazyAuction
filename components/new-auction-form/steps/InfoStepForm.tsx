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

import {
  AuctionFormInfo,
  auctionFormInfoSchema,
} from '@/lib/schemas/auctionSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { FormStepProps } from '../types';
import StepNavigation from './StepNavigation';

const InfoStepForm = (props: FormStepProps) => {
  const { currentStep, nextStep, prevStep, updateStore, storedData } = props;

  const saveStep = async (data: AuctionFormInfo) => {
    updateStore(data);
    nextStep();
  };

  const infoForm = useForm({
    resolver: zodResolver(auctionFormInfoSchema),
    defaultValues: {
      title: storedData.title ?? '',
      description: storedData.description ?? '',
      tags: storedData.tags ?? [],
    },
  });

  const { control, formState, setValue, handleSubmit } = infoForm;

  const { isSubmitting } = formState;

  const handleTagsChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Transform the input value into an array
    const tags = event.target.value.split(',').map((tag) => tag.trim());
    // Update the form control with the new array
    setValue('tags', tags, { shouldValidate: true });
  };

  return (
    <Form {...infoForm}>
      <form
        className='flex w-full max-w-lg flex-col gap-5'
        onSubmit={handleSubmit(saveStep)}
      >
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

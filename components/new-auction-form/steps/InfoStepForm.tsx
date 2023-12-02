'use client';
import { Button } from '@/components/ui/button';
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
import { NewAuctionFormProps } from '../types';

const InfoStepForm = ({ mode = 'create', listing }: NewAuctionFormProps) => {
  const { infoForm, saveStep } = useMultiStepAuctionForm({
    mode,
    listing,
    step: 'info',
    nextStep: 'media',
  });
  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
    setValue,
    getValues,
  } = infoForm;

  return (
    <Form {...infoForm}>
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
                  className='bg-foreground text-background'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex w-full justify-end gap-4'>
          <Button variant='outline' type='button'>
            Cancel
          </Button>
          <Button variant='accent' type='submit'>
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InfoStepForm;

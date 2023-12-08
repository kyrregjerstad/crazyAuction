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

import useMultiStepAuctionForm from '@/lib/hooks/forms/useMultiStepForm';
import { Label } from '@radix-ui/react-dropdown-menu';
import dayjs from 'dayjs';
import { ChangeEvent } from 'react';
import { Calendar } from '../../ui/calendar';
import { FormStepProps } from '../types';
import StepNavigation from './StepNavigation';

const DateStepForm = (props: FormStepProps) => {
  const { currentStep, nextStep, prevStep } = props;

  const { dateTime, saveStep } = useMultiStepAuctionForm(props);

  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
  } = dateTime;

  const today = dayjs();
  const oneYearFromNow = today.add(1, 'year');
  const startOfDay = today.startOf('day');
  const endOfDayOneYearFromNow = oneYearFromNow.endOf('day');

  return (
    <Form {...dateTime}>
      <form className='flex w-full max-w-lg flex-col gap-5' onSubmit={saveStep}>
        <FormField
          control={control}
          name='dateTime'
          render={({ field }) => {
            const handleDateChange = (selectedDate: Date | undefined) => {
              if (selectedDate) {
                const currentTime = new Date(field.value || Date.now());
                const hours = currentTime.getHours();
                const minutes = currentTime.getMinutes();

                selectedDate.setHours(hours, minutes);
                field.onChange(selectedDate.toISOString());
              }
            };

            const handleTimeChange = (time: ChangeEvent<HTMLInputElement>) => {
              const [hours, minutes] = time.target.value.split(':');
              const newDate = new Date(field.value);
              newDate.setHours(parseInt(hours), parseInt(minutes));
              field.onChange(newDate.toISOString());
            };

            return (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <>
                    <Calendar
                      mode='single'
                      selected={new Date(field.value)}
                      onSelect={handleDateChange}
                      className='flex'
                      disabled={(date) =>
                        date < startOfDay.toDate() ||
                        date > endOfDayOneYearFromNow.toDate()
                      }
                    />
                    <div className='px-4 pb-4 pt-0'>
                      <Label>Time</Label>
                      <Input
                        type='time'
                        onChange={handleTimeChange}
                        value={dayjs(field.value).format('HH:mm')}
                        className='w-fit'
                      />
                    </div>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <StepNavigation
          disabled={!isDirty || isSubmitting}
          currentStep={currentStep}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      </form>
    </Form>
  );
};

export default DateStepForm;

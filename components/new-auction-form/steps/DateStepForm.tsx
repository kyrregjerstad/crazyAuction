'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { AuctionFormDate, auctionFormDateSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-dropdown-menu';
import dayjs from 'dayjs';
import { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar } from '../../ui/calendar';
import { FormStepProps } from '../types';
import StepNavigation from './StepNavigation';

const DateStepForm = (props: FormStepProps) => {
  const { currentStep, nextStep, prevStep, updateStore, storedData } = props;

  const dateTimeForm = useForm({
    resolver: zodResolver(auctionFormDateSchema),
    defaultValues: {
      dateTime: storedData.dateTime ?? '',
    },
  });

  const { control, formState, handleSubmit } = dateTimeForm;

  const { isSubmitting, isValid, isDirty } = formState;

  const saveStep = async (data: AuctionFormDate) => {
    updateStore(data);
    nextStep();
  };

  const today = dayjs();
  const oneYearFromNow = today.add(1, 'year');
  const startOfDay = today.startOf('day');
  const endOfDayOneYearFromNow = oneYearFromNow.endOf('day');

  return (
    <Form {...dateTimeForm}>
      <form
        className='flex h-full w-full flex-1 flex-col justify-between gap-5'
        onSubmit={handleSubmit(saveStep)}
      >
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
                <FormControl>
                  <div className='flex w-full flex-col items-center justify-center sm:flex-row sm:items-start sm:justify-start'>
                    <div className='flex w-full flex-col justify-center gap-4 xs:flex-row '>
                      <Calendar
                        mode='single'
                        selected={new Date(field.value)}
                        onSelect={handleDateChange}
                        className='flex w-full max-w-sm rounded-lg bg-white p-4 text-black'
                        disabled={(date) =>
                          date < startOfDay.toDate() ||
                          date > endOfDayOneYearFromNow.toDate()
                        }
                      />
                      <div className=''>
                        <Label>Time</Label>
                        <Input
                          type='time'
                          onChange={handleTimeChange}
                          value={dayjs(field.value).format('HH:mm')}
                          className='w-fit bg-white text-black'
                        />
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <StepNavigation
          disabled={!isValid || isSubmitting || !isDirty}
          currentStep={currentStep}
          prevStep={prevStep}
        />
      </form>
    </Form>
  );
};

export default DateStepForm;

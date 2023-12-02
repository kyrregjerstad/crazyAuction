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

import useMultiStepAuctionForm from '@/lib/hooks/forms/useMultiStepForm';
import { NewAuctionFormProps } from '../types';
import { Label } from '@radix-ui/react-dropdown-menu';
import dayjs from 'dayjs';
import { ChangeEvent } from 'react';
import { Calendar } from '../../ui/calendar';

const DateStepForm = ({ mode = 'create', listing }: NewAuctionFormProps) => {
  const { dateForm, saveStep } = useMultiStepAuctionForm({
    mode,
    listing,
    step: 'time',
    nextStep: 'summary',
  });
  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
    getFieldState,
    watch,
    setValue,
    getValues,
  } = dateForm;

  const today = dayjs();
  const oneYearFromNow = today.add(1, 'year');
  const startOfDay = today.startOf('day');
  const endOfDayOneYearFromNow = oneYearFromNow.endOf('day');

  return (
    <Form {...dateForm}>
      <form className='flex w-full max-w-lg flex-col gap-5' onSubmit={saveStep}>
        <FormField
          control={control}
          name='dateTime'
          render={({ field }) => {
            const handleDateChange = (selectedDate: Date | undefined) => {
              if (selectedDate) {
                const currentTime = new Date(field.value);
                const hours = currentTime.getHours();
                const minutes = currentTime.getMinutes();

                selectedDate.setHours(hours, minutes);
                field.onChange(selectedDate);
              }
            };

            const handleTimeChange = (time: ChangeEvent<HTMLInputElement>) => {
              const [hours, minutes] = time.target.value.split(':');
              const newDate = new Date(field.value);
              newDate.setHours(parseInt(hours), parseInt(minutes));
              field.onChange(newDate);
            };

            return (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <>
                    <Calendar
                      mode='single'
                      selected={field.value}
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
        <div className='flex w-full justify-end gap-4'>
          <Button variant='outline' type='button'>
            Back
          </Button>
          <Button variant='accent' type='submit'>
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DateStepForm;

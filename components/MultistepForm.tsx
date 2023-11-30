'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SelectSingleEventHandler } from 'react-day-picker';
import { DateTime } from 'luxon';

import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useAuctionForm from '@/lib/hooks/forms/useAuctionForm';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

import useUploadImage from '@/lib/hooks/useUploadImage';
import { AuctionFormComplete } from '@/lib/services/postListing';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import NewAuctionImageGallery from './NewAuctionImageGallery';
import Spinner from './Spinner';
import { ListingFull } from '@/lib/schemas/listing';
import useMultiStepAuctionForm from '@/lib/hooks/forms/useMultiStepForm';
import { Card } from './ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { DateTimePicker } from './DateTimePicker';
import { Label } from './ui/label';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Step = 'info' | 'media' | 'time' | 'summary';

type Props = {
  mode: 'create' | 'edit';
  listing: ListingFull | null;
};
const MultiStepForm = ({ mode = 'create', listing }: Props) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  let currentStep = searchParams.get('step') as Step | undefined;

  if (!currentStep) {
    currentStep = 'info';
  }

  if (
    currentStep &&
    currentStep !== 'info' &&
    currentStep !== 'media' &&
    currentStep !== 'time' &&
    currentStep !== 'summary'
  ) {
    currentStep = 'info';
  }

  const { form, postAuction } = useAuctionForm({ mode, listing });
  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
    setValue,
    getValues,
  } = form;

  const { handleUploadImage, imagesUploading, handleSelectImage } =
    useUploadImage();

  const images = getValues('imageUrls');

  const today = dayjs();
  const oneYearFromNow = today.add(1, 'year');
  const startOfDay = today.startOf('day');
  const endOfDayOneYearFromNow = oneYearFromNow.endOf('day');

  return (
    <>
      <Card className='flex w-full max-w-xl gap-5 p-4'>
        <Overview currentStep={currentStep} />
        <div className='flex w-full flex-col gap-4'>
          <>
            {currentStep === 'info' && (
              <InfoStepForm mode={mode} listing={listing} />
            )}
            {currentStep === 'media' && (
              <MediaStepForm mode={mode} listing={listing} />
            )}
            {currentStep === 'time' && (
              <TimeStepForm mode={mode} listing={listing} />
            )}
            {currentStep === 'summary' && <SummaryStepForm />}
          </>
        </div>
      </Card>
      {/* <NewAuctionImageGallery images={images} setValue={setValue} /> */}
    </>
  );
};

export default MultiStepForm;

type StepsProps = {
  currentStep: Step;
};
const Overview = ({ currentStep }: StepsProps) => {
  const steps: { title: string; step: Step; description: string }[] = [
    {
      title: 'Info',
      step: 'info',
      description: 'Enter the title, description, and tags for your auction.',
    },
    {
      title: 'Media',
      step: 'media',
      description: 'Upload images for your auction.',
    },
    {
      title: 'End Date',
      step: 'time',
      description: 'Set the end time for your auction.',
    },
    {
      title: 'Summary',
      step: 'summary',
      description: 'Review your auction details and submit.',
    },
  ];

  return (
    <div className='flex flex-col gap-2 bg-accent-950 p-4'>
      <ul>
        {steps.map(({ title, step }, i) => (
          <li
            key={title}
            className={cn(
              'relative whitespace-nowrap text-lg',
              currentStep === step && 'font-bold',
            )}
          >
            {currentStep === step && (
              <motion.span
                layout
                layoutId='step-indicator'
                className='absolute -left-3 top-2 h-2 w-2 rounded-full bg-accent-500'
              />
            )}
            <Link href={`?step=${step}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const InfoStepForm = ({ mode = 'create', listing }: Props) => {
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

const MediaStepForm = ({ mode = 'create', listing }: Props) => {
  const { mediaForm, saveStep } = useMultiStepAuctionForm({
    mode,
    listing,
    step: 'media',
    nextStep: 'time',
  });
  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
    setValue,
    getValues,
  } = mediaForm;

  const images = getValues('imageUrls');

  const { handleUploadImage, imagesUploading, handleSelectImage } =
    useUploadImage();

  return (
    <Form {...mediaForm}>
      <form className='flex w-full max-w-lg flex-col gap-5' onSubmit={saveStep}>
        <FormField
          control={control}
          name='images'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>

              <FormControl>
                <div className='flex flex-col gap-4'>
                  <Input
                    type='file'
                    placeholder='Upload files'
                    multiple
                    max={8 - images.length}
                    accept='image/*'
                    className='flex items-center justify-center'
                    onChange={(event) =>
                      handleSelectImage({ event, field, images })
                    }
                  />
                  <div className='flex gap-4'>
                    <Input type='url' placeholder='Add link' />
                    <Button>Add link</Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <NewAuctionImageGallery images={images} setValue={setValue} />
        <div className='flex w-full justify-end gap-4'>
          <Button variant='outline' type='button'>
            Cancel
          </Button>
          <Button
            variant='accent'
            type='submit'
            onClick={() => console.log(mediaForm.formState)}
          >
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

const TimeStepForm = ({ mode = 'create', listing }: Props) => {
  const { timeForm, saveStep } = useMultiStepAuctionForm({
    mode,
    listing,
    step: 'time',
    nextStep: 'summary',
  });
  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
    setValue,
    getValues,
  } = timeForm;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = dayjs();
  const oneYearFromNow = today.add(1, 'year');
  const startOfDay = today.startOf('day');
  const endOfDayOneYearFromNow = oneYearFromNow.endOf('day');

  const [selectedDateTime, setSelectedDateTime] = useState<DateTime>(
    DateTime.fromJSDate(selectedDate || new Date()),
  );

  const handleSelect: SelectSingleEventHandler = (day, selected) => {
    const selectedDay = DateTime.fromJSDate(selected);
    const modifiedDay = selectedDay.set({
      hour: selectedDateTime.hour,
      minute: selectedDateTime.minute,
    });

    setSelectedDateTime(modifiedDay);
    setSelectedDate(modifiedDay.toJSDate());
  };

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    const hours = Number.parseInt(value.split(':')[0] || '00', 10);
    const minutes = Number.parseInt(value.split(':')[1] || '00', 10);
    const modifiedDay = selectedDateTime.set({ hour: hours, minute: minutes });

    setSelectedDateTime(modifiedDay);
    setSelectedDate(modifiedDay.toJSDate());
  };

  return (
    <Form {...timeForm}>
      <form className='flex w-full max-w-lg flex-col gap-5' onSubmit={saveStep}>
        <FormField
          control={control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <>
                  {/* <DateTimePicker date={selectedDate} setDate={setSelectedDate} /> */}
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    className='flex'
                    disabled={(date) =>
                      date < startOfDay.toDate() ||
                      date > endOfDayOneYearFromNow.toDate()
                    }
                  />
                  <>
                    <div className='px-4 pb-4 pt-0'>
                      <Label>Time</Label>
                      <Input
                        type='time'
                        onChange={handleTimeChange}
                        value={selectedDateTime.toFormat('HH:mm')}
                        className='w-fit'
                      />
                    </div>
                    {!selectedDateTime && <p>Please pick a day.</p>}
                  </>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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

const SummaryStepForm = () => {
  const { summaryForm, saveStep } = useMultiStepAuctionForm({
    mode: 'create',
    listing: null,
    step: 'summary',
    nextStep: 'summary',
  });
  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
    setValue,
    getValues,
  } = summaryForm;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = dayjs();
  const oneYearFromNow = today.add(1, 'year');
  const startOfDay = today.startOf('day');
  const endOfDayOneYearFromNow = oneYearFromNow.endOf('day');

  return (
    <Form {...summaryForm}>
      <form className='flex w-full max-w-lg flex-col gap-5' onSubmit={saveStep}>
        <FormField
          control={control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Calendar
                  mode='single'
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < startOfDay.toDate() ||
                    date > endOfDayOneYearFromNow.toDate()
                  }
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

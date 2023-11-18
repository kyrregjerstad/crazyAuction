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
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

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
import postListing, {
  FormValues,
  formSchema,
} from '@/lib/services/postListing';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';

const NewAuctionForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const session = useSession();

  const today = dayjs();
  const oneYearFromNow = today.add(1, 'year');

  // Remove the time part for comparison
  const startOfDay = today.startOf('day');
  const endOfDayOneYearFromNow = oneYearFromNow.endOf('day');

  const onSubmit: SubmitHandler<FormValues> = (data) =>
    postListing({ formData: data, jwt: session.data!.user.accessToken });

  return (
    <Form {...form}>
      <form
        className='flex w-full max-w-lg flex-col gap-5'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
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
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Description'
                  {...field}
                  className='bg-foreground text-background'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='media'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Media</FormLabel>
              <FormControl>
                <Input
                  placeholder='Media'
                  type='file'
                  {...field}
                  className='bg-foreground text-background'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
        <div className='flex gap-2'>
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem className='flex-2'>
                <FormLabel>Ending Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start bg-white text-left font-normal text-background',
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='flex w-auto flex-col space-y-2 p-2'>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(addDays(new Date(), parseInt(value)))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select' />
                      </SelectTrigger>
                      <SelectContent position='popper'>
                        <SelectItem value='0'>Today</SelectItem>
                        <SelectItem value='1'>Tomorrow</SelectItem>
                        <SelectItem value='3'>In 3 days</SelectItem>
                        <SelectItem value='7'>In a week</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className='rounded-md border'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < startOfDay.toDate() ||
                          date > endOfDayOneYearFromNow.toDate()
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='time'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>Ending Time</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Time'
                    type='time'
                    {...field}
                    className='bg-foreground text-background'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <div className='mb-4'>
          <Label className='block text-sm font-medium' htmlFor='title'>
            Title
          </Label>
          <Input
            className='mt-1 w-full bg-white text-background'
            id='title'
            type='text'
          />
        </div>
        <div className='mb-4'>
          <Label className='block text-sm font-medium' htmlFor='description'>
            Description
          </Label>
          <Textarea className='mt-1 w-full bg-white text-background' />
        </div>
        <div className='mb-4'>
          <Label className='block text-sm font-medium' htmlFor='media'>
            Media
          </Label>
          <Input
            className='mt-1 w-full bg-white text-background'
            id='media'
            type='file'
          />
        </div>
        <div className='mb-4'>
          <Label className='block text-sm font-medium' htmlFor='tags'>
            Tags
          </Label>
          <Input
            className='mt-1 w-full bg-white text-background'
            id='tags'
            type='text'
          />
        </div>
        <div className='mb-6 flex gap-2'>
          <div className='flex-1'>
            <Label className='block text-sm font-medium' htmlFor='date'>
              Ending Date
            </Label>
            <AuctionEndDatePicker />
          </div>
          <div className='w-18 '>
            <Label className='block text-sm font-medium' htmlFor='date'>
              Ending Time
            </Label>
            <Input
              className='w-full bg-white text-background'
              id='time'
              type='time'
            />
          </div>
        </div> */}
        <Button
          className='hover:bg-accent-hover focus:bg-accent-hover w-full bg-accent text-white'
          type='submit'
        >
          Create Auction
        </Button>
      </form>
    </Form>
  );
};

export default NewAuctionForm;

'use client';
import { Button, buttonVariants } from '@/components/ui/button';
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

import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import Spinner from './Spinner';
import { useState } from 'react';

const NewAuctionForm = () => {
  const { form, postAuction } = useAuctionForm();
  const { postImage } = useUploadImage();
  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
    setValue,
  } = form;

  type CloudinaryUploadEventResult = {
    event: string;
    info: {
      asset_id: string;
      bytes: number;
      created_at: string;
      etag: string;
      format: string;
      height: number;
      original_filename: string;
      placeholder: boolean;
      public_id: string;
      resource_type: string;
      secure_url: string;
      signature: string;
      tags: string[];
      type: string;
      url: string;
      version: number;
      version_id: string;
      width: number;
    };
  };

  const handleUploadSuccess = (result: CloudinaryUploadEventResult) => {
    const newUrl = result?.info.secure_url;
    if (newUrl) {
      const updatedMedia = [newUrl];
      setValue('media', updatedMedia);
    }
  };
  const today = dayjs();
  const oneYearFromNow = today.add(1, 'year');

  const startOfDay = today.startOf('day');
  const endOfDayOneYearFromNow = oneYearFromNow.endOf('day');

  const [images, setImages] = useState<string[]>([]);

  // const images = [
  //   'https://picsum.photos/id/1/200',
  //   'https://picsum.photos/id/2/200',
  //   'https://picsum.photos/id/3/200',
  //   'https://picsum.photos/id/4/200',
  //   'https://picsum.photos/id/5/200',
  //   // 'https://picsum.photos/id/6/200',
  //   // 'https://picsum.photos/id/7/200',
  //   // 'https://picsum.photos/id/8/200',
  // ];

  // setImages([
  //   'https://picsum.photos/id/1/200',
  //   'https://picsum.photos/id/2/200',
  //   'https://picsum.photos/id/3/200',
  //   'https://picsum.photos/id/4/200',
  //   'https://picsum.photos/id/5/200',
  //   // 'https://picsum.photos/id/6/200',
  //   // 'https://picsum.photos/id/7/200',
  //   // 'https://picsum.photos/id/8/200',
  // ]);

  const testSubmit = async () => {};

  return (
    <>
      <div className='flex w-full flex-col gap-5 p-4 md:flex-row'>
        <Button onClick={testSubmit} variant='outline'>
          Test
        </Button>

        <Form {...form}>
          <form
            className='flex w-full max-w-lg flex-col gap-5'
            onSubmit={postAuction}
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
                      className='bg-foreground text-background'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='media'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media</FormLabel>

                  <FormControl>
                    <>
                      <div className='flex gap-4'>
                        <Button
                          type='button'
                          variant='outline'
                          className='flex-1'
                        >
                          Upload Files
                        </Button>
                        <Popover>
                          <PopoverTrigger
                            className={`${buttonVariants({
                              variant: 'outline',
                            })} flex-1`}
                          >
                            Add Links
                          </PopoverTrigger>
                          <PopoverContent className='flex flex-col gap-4'>
                            <Input
                              placeholder='url'
                              className='bg-foreground text-background'
                            />
                            <Button type='button' className='w-full bg-accent'>
                              Add
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </>
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
            <div className='flex gap-2'>
              <FormField
                control={control}
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
                control={control}
                name='time'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Ending Time</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Time'
                        type='time'
                        defaultValue={format(today.toDate(), 'HH:mm')}
                        {...field}
                        className='bg-foreground text-background'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              className='w-full bg-accent'
              type='submit'
              disabled={isSubmitting || !isDirty || isSubmitSuccessful}
            >
              {isSubmitting ? (
                <Spinner />
              ) : isSubmitSuccessful ? (
                'Auction Created! 🎉'
              ) : (
                'Create Auction'
              )}
            </Button>
          </form>
          <span id='reward' />
        </Form>
        <ImageGallery images={images} />
      </div>
    </>
  );
};

export default NewAuctionForm;

const useUploadImage = () => {
  const postImage = async () => {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
      });

      const data = await res.json();

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return { postImage };
};

const ImageGallery = ({ images }: { images: string[] }) => {
  const getGridCols = (length: number) => {
    if (length <= 3) return 'grid-cols-1';
    if (length <= 6) return 'grid-cols-2';
    if (length <= 8) return 'grid-cols-3';
    return 'grid-cols-2';
  };

  return (
    <div className={`grid ${getGridCols(images.length)} h-fit gap-4`}>
      {images.map((image) => (
        <div key={image}>
          <img
            key={image}
            src={image}
            alt='test'
            className='h-auto max-w-full rounded-lg'
          />
        </div>
      ))}
    </div>
  );
};

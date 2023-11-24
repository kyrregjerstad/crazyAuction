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

import { uploadToCloudinary } from '@/lib/server/actions';
import { useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import NewAuctionImageGallery from './NewAuctionImageGallery';
import Spinner from './Spinner';

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

  const [images, setImages] = useState<string[]>([
    'https://picsum.photos/id/1/1000',
    'https://picsum.photos/id/2/1000',
    'https://picsum.photos/id/3/1000',
    'https://picsum.photos/id/4/1000',
    'https://picsum.photos/id/5/1000',
  ]);

  // setImages([
  // 'https://picsum.photos/id/1/200',
  // 'https://picsum.photos/id/2/200',
  // 'https://picsum.photos/id/3/200',
  // 'https://picsum.photos/id/4/200',
  // 'https://picsum.photos/id/5/200',
  //   // 'https://picsum.photos/id/6/200',
  //   // 'https://picsum.photos/id/7/200',
  //   // 'https://picsum.photos/id/8/200',
  // ]);

  const [imagesUploading, setImagesUploading] = useState(false);

  type HandleUploadParams = {
    field: ControllerRenderProps<
      {
        date: Date;
        time: string;
        title: string;
        media: (string | undefined)[];
        description?: string;
        images?: FileList;
        tags?: string;
      },
      'images'
    >;
  }; // TODO: let's get this from the validation schema

  const handleUploadImage = async ({ field }: HandleUploadParams) => {
    if (!field.value) {
      console.log('No files selected.');
      return;
    }

    const form = new FormData();
    const fileList = field.value;
    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      form.append('image', file);
    }

    setImagesUploading(true);
    try {
      const res = await uploadToCloudinary(form);
      console.log(res);
      setImagesUploading(false);
      setImages((prev) => [...prev, ...res]);
    } catch (error) {
      console.error('Error uploading images', error);
      setImagesUploading(false);
    }
  };

  type HandleSelectImageParams = {
    event: React.ChangeEvent<HTMLInputElement>;
    field: ControllerRenderProps<
      {
        date: Date;
        time: string;
        title: string;
        media: (string | undefined)[];
        description?: string;
        images?: FileList;
        tags?: string;
      },
      'images'
    >;
  };

  const handleSelectImage = async ({
    event,
    field,
  }: HandleSelectImageParams) => {
    const files = event.target.files;

    if (images.length + files?.length! > 8) {
      console.log('Too many files');
      alert('You can only upload a total of 8 images, please remove some.');
      e.target.value = '';
      return;
    }

    field.onChange(files);
  };

  return (
    <>
      <div className='flex w-full flex-col items-center gap-5 p-4 md:flex-row md:items-start'>
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
              name='images'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media</FormLabel>

                  <FormControl>
                    <>
                      <div className='flex gap-4'>
                        <Input
                          type='file'
                          placeholder='Upload files'
                          multiple
                          max={8 - images.length}
                          accept='image/*'
                          onChange={(event) =>
                            handleSelectImage({ event, field })
                          }
                        />
                        <Button
                          type='button'
                          variant='outline'
                          className='flex-1'
                          onClick={() => handleUploadImage({ field })}
                          disabled={
                            imagesUploading ||
                            images.length >= 8 ||
                            !field.value
                          }
                        >
                          {imagesUploading ? <Spinner /> : 'Upload'}
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
            <div className='flex w-full items-center justify-center'>
              <span id='reward' />
            </div>
          </form>
        </Form>
        <NewAuctionImageGallery images={images} setImages={setImages} />
      </div>
    </>
  );
};

export default NewAuctionForm;

const useUploadImage = () => {
  const postImage = async (fileList: FileList) => {
    const form = new FormData();

    form.set('file', fileList[0]);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error('Error converting files to base64', error);
    }
  };

  return { postImage };
};

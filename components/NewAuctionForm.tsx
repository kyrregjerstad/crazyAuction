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
import { AuctionForm } from '@/lib/services/postListing';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import NewAuctionImageGallery from './NewAuctionImageGallery';
import Spinner from './Spinner';
import { ListingFull } from '@/lib/schemas/listing';

type Props = {
  mode: 'create' | 'edit';
  listing: ListingFull | null;
};
const AuctionForm = ({ mode = 'create', listing }: Props) => {
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
                  <FormLabel>Images</FormLabel>

                  <FormControl>
                    <div className='flex gap-4'>
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
                      <Button
                        type='button'
                        variant='outline'
                        className='flex-1'
                        onClick={async () => {
                          const imageUrls = await handleUploadImage({ field });
                          if (!imageUrls) return;
                          /* each image src is put here, this is what's being used on the form submission */
                          setValue('imageUrls', [...images, ...imageUrls], {
                            shouldValidate: true,
                          });
                        }}
                        disabled={
                          imagesUploading || images.length >= 8 || !field.value
                        }
                      >
                        {imagesUploading ? <Spinner /> : 'Upload'}
                      </Button>
                      <LinkPopover images={images} setValue={setValue} />
                    </div>
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
                mode === 'edit' ? (
                  'Auction Updated! 🎉'
                ) : (
                  'Auction Updated 👌'
                )
              ) : mode === 'edit' ? (
                'Update Auction'
              ) : (
                'Create Auction'
              )}
            </Button>
            <div className='flex w-full items-center justify-center'>
              <span id='reward' />
            </div>
          </form>
        </Form>
        <NewAuctionImageGallery images={images} setValue={setValue} />
      </div>
    </>
  );
};

export default AuctionForm;

type LinkPopoverProps = {
  images: string[];
  setValue: UseFormSetValue<AuctionForm>;
};

const LinkPopover = ({ images, setValue }: LinkPopoverProps) => {
  const { handleAddLink, imagesUploading } = useUploadImage();

  const [link, setLink] = useState<string>('');

  return (
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
          value={link}
          onChange={(e) => setLink(e.currentTarget.value)}
        />
        <FormDescription>Add a publicly available image link.</FormDescription>
        <Button
          type='button'
          className='w-full bg-accent'
          disabled={!link || images.length >= 8 || imagesUploading}
          onClick={async () => {
            const validLink = await handleAddLink({ link });
            if (!validLink) return;
            const newImageUrls = [...images, validLink];
            setValue('imageUrls', newImageUrls, { shouldValidate: true });
            setLink('');
          }}
        >
          {imagesUploading ? <Spinner /> : 'Add'}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

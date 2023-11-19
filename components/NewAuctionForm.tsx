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
import { useRouter } from 'next/navigation';
import { CldUploadWidget, CldUploadWidgetProps } from 'next-cloudinary';
import { useState } from 'react';

const NewAuctionForm = () => {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const session = useSession();

  const [resources, setResources] = useState<string[]>([]);

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
      form.setValue('media', updatedMedia);
      setResources((prev) => [...prev, result.info.secure_url]);
    }
  };
  const today = dayjs();
  const oneYearFromNow = today.add(1, 'year');

  const startOfDay = today.startOf('day');
  const endOfDayOneYearFromNow = oneYearFromNow.endOf('day');

  const onSubmit: SubmitHandler<FormValues> = (data) =>
    postListing({ formData: data, jwt: session.data!.user.accessToken }).then(
      (data) => {
        if (data?.id) router.push(`/item/${data.id}`);
      },
    );

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
          control={form.control}
          name='media'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Media</FormLabel>

              <FormControl>
                <CldUploadWidget
                  uploadPreset='ohkdlhxr'
                  // the cloudinary widget is not properly typed
                  // @ts-ignore
                  onSuccess={handleUploadSuccess}
                >
                  {({ open }) => (
                    <Button
                      className='w-full bg-accent text-white hover:bg-accent-hover focus:bg-accent-hover'
                      type='button'
                      onClick={() => open()}
                    >
                      Upload an Image
                    </Button>
                  )}
                </CldUploadWidget>
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
          className='w-full bg-accent text-white hover:bg-accent-hover focus:bg-accent-hover'
          type='submit'
          disabled={form.formState.isSubmitting}
        >
          Create Auction
        </Button>
      </form>
    </Form>
  );
};

export default NewAuctionForm;

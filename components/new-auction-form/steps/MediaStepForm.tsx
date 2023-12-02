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
import { NewAuctionFormProps, UploadImage } from '../types';
import { getCloudinarySignature } from '@/lib/server/actions';
import { nanoid } from 'nanoid';
import { useState, useEffect, ChangeEvent } from 'react';
import NewAuctionImageGallery from '../../NewAuctionImageGallery';

const MediaStepForm = ({ mode = 'create', listing }: NewAuctionFormProps) => {
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

  const [images, setImages] = useState<UploadImage[]>([]);

  const action = async () => {
    const updatedImages = await Promise.all(
      images.map(async (image) => {
        if (!image.file || image.publicUrl) return image;

        const { signature, timestamp } = await getCloudinarySignature();

        const formData = new FormData();
        formData.append('file', image.file);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString());
        formData.append('folder', 'crazy_auction');

        const endpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;

        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          const { public_id, secure_url } = data;

          if (public_id && secure_url) {
            return {
              ...image,
              publicUrl: secure_url,
            };
          }
        } catch (error) {
          console.error('Upload failed for image:', image.id, error);
        }

        return image;
      }),
    );

    setImages(updatedImages);
  };

  useEffect(() => {
    const publicUrls = images
      .filter((image) => image.publicUrl !== undefined)
      .map((image) => image.publicUrl!);

    setValue('imageUrls', publicUrls);
  }, [images, setValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles) return;

    const newImages = Array.from(newFiles).map((file) => ({
      id: nanoid(),
      file: file,
      previewUrl: URL.createObjectURL(file),
      publicUrl: undefined, // initially undefined, will be updated on upload
    }));

    // Combine the new images with the existing ones
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  return (
    <>
      <form action={action}>
        <input
          type='file'
          name='image'
          id='image'
          accept='image/*'
          onChange={handleChange}
          multiple
        />
        <Button type='submit'>Upload</Button>
      </form>
      <div>
        <NewAuctionImageGallery images={images} setImages={setImages} />
      </div>
      <Form {...mediaForm}>
        <form
          className='flex w-full max-w-lg flex-col gap-5'
          onSubmit={saveStep}
        >
          <FormField
            control={control}
            name='imageUrls'
            render={({ field }) => {
              console.log(field.value);
              return (
                <FormItem>
                  <FormControl>
                    <Input {...field} type='hidden' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
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
    </>
  );
};

export default MediaStepForm;

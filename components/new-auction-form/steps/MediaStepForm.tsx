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
import { useState, useEffect, ChangeEvent, useRef } from 'react';
import NewAuctionImageGallery from '../../NewAuctionImageGallery';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpFromLine } from 'lucide-react';

const MediaStepForm = ({
  mode = 'create',
  listing,
  children,
}: NewAuctionFormProps) => {
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
  const [rejected, setRejected] = useState<UploadImage[]>([]);

  const uploadRef = useRef<HTMLFormElement>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const newImages = Array.from(acceptedFiles).map((file) => ({
        id: nanoid(),
        file: file,
        previewUrl: URL.createObjectURL(file),
        publicUrl: undefined, // initially undefined, will be updated on upload
      }));

      setImages((prevImages) => [...prevImages, ...newImages]);
    }

    if (rejectedFiles?.length) {
      const newRejected = Array.from(rejectedFiles).map((file) => ({
        id: nanoid(),
        file: file,
        previewUrl: URL.createObjectURL(file),
        publicUrl: undefined, // initially undefined, will be updated on upload
      }));

      setRejected((prevRejected) => [...prevRejected, ...newRejected]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxSize: 1024 * 1000,
    maxFiles: 8,
    onDrop,
  });

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
      <form action={action} ref={uploadRef}>
        <div {...getRootProps()} className='cursor-pointer'>
          <input {...getInputProps({ name: 'file' })} />
          <div className='shadow-dropzone flex flex-col items-center justify-center gap-4 rounded-md bg-neutral-700 p-4'>
            <ArrowUpFromLine />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag & drop files here, or click to select files</p>
            )}
          </div>
        </div>
        {/* <Button type='submit'>Upload</Button> */}
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
          {children}
        </form>
      </Form>
    </>
  );
};

export default MediaStepForm;

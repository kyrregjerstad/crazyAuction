'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import Sparkles from '@/components/Sparkles';
import useMultiStepAuctionForm from '@/lib/hooks/forms/useMultiStepForm';
import { getCloudinarySignature } from '@/lib/server/actions';
import { ArrowUpFromLine } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import NewAuctionImageGallery from '../../NewAuctionImageGallery';
import { FormStepProps, UploadImage } from '../types';
import StepNavigation from './StepNavigation';
import SubmitBtn from './SubmitBtn';

const MediaStepForm = (props: FormStepProps) => {
  const { currentStep, nextStep, prevStep } = props;
  const { media, saveStep } = useMultiStepAuctionForm(props);

  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
    setValue,
  } = media;

  const [images, setImages] = useState<UploadImage[]>([]);
  const [rejected, setRejected] = useState<FileRejection[]>([]);
  const [allImagesUploaded, setAllImagesUploaded] = useState(false);

  useEffect(() => {
    const publicUrls = images
      .filter((image) => image.publicUrl !== undefined)
      .map((image) => image.publicUrl!);

    setValue('imageUrls', publicUrls);
  }, [images, setValue]);

  useEffect(() => {
    setAllImagesUploaded(
      images.every((image) => image.publicUrl !== undefined),
    );
  }, [images, setAllImagesUploaded]);

  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      _fileRejections: FileRejection[],
      _event: DropEvent,
    ) => {
      if (acceptedFiles?.length) {
        const newImages = Array.from(acceptedFiles).map((file) => ({
          id: nanoid(),
          file: file,
          previewUrl: URL.createObjectURL(file),
          publicUrl: undefined, // initially undefined, will be updated on upload
        }));

        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxSize: 1024 * 1000, // 1MB
    maxFiles: 8,
    onDrop,
  });

  const action = async () => {
    const updatedImages = await Promise.all(
      images.map(async (image) => {
        if (!image.file || image.publicUrl) return image;

        const { signature, timestamp } = await getCloudinarySignature();

        const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        if (!API_KEY) {
          console.error('Missing CLOUDINARY_API_KEY env variable');
          return image;
        }

        const formData = new FormData();
        formData.append('file', image.file);
        formData.append('api_key', API_KEY);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString());
        formData.append('folder', 'crazy_auction');

        const endpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;
        if (!endpoint) {
          console.error('Missing CLOUDINARY_UPLOAD_URL env variable');
          return image;
        }

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

  return (
    <>
      <form action={action} className='flex flex-col gap-4'>
        <div {...getRootProps()} className='cursor-pointer'>
          <input {...getInputProps({ name: 'file' })} />
          <div className='relative flex flex-col items-center justify-center gap-4 rounded-md bg-neutral-700 p-4 shadow-dropzone'>
            {images.length === 0 ? (
              <>
                <ArrowUpFromLine />
                <p>Drag & drop files here, or click to select files</p>
                <p className='text-center text-sm text-neutral-400'>
                  Auctions with images are more likely to sell. Add up to 8
                  images
                </p>
              </>
            ) : (
              <p className='text-sm text-neutral-500'>
                {images.length} images selected
              </p>
            )}
            <NewAuctionImageGallery images={images} setImages={setImages} />
            {isDragActive && (
              <div className='absolute bottom-0 top-0 z-50 flex w-full items-center justify-center bg-background bg-opacity-60 text-center text-neutral-100 backdrop-blur-sm'>
                <Sparkles animate>
                  <p className='animate-bounce'>Drop it like it&apos;s hot</p>
                </Sparkles>
              </div>
            )}
          </div>
        </div>
        <div className='flex w-full justify-end'>
          <SubmitBtn disabled={allImagesUploaded} />
        </div>
      </form>
      <div></div>
      <Form {...media}>
        <form
          className='flex w-full max-w-lg flex-col gap-5'
          onSubmit={saveStep}
        >
          <FormField
            control={control}
            name='imageUrls'
            render={({ field }) => {
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
          <StepNavigation
            currentStep={currentStep}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        </form>
      </Form>
    </>
  );
};

export default MediaStepForm;

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
import useAuctionFormStore from '@/lib/hooks/useAuctionFormStore';
import useStore from '@/lib/hooks/useStore';
import { AuctionFormMedia, auctionFormMediaSchema } from '@/lib/schemas';
import { getCloudinarySignature } from '@/lib/server/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpFromLine } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import { UseFormReturn, useForm } from 'react-hook-form';
import NewAuctionImageGallery from '../../NewAuctionImageGallery';
import { FormStepProps, Step, UploadImage } from '../types';
import StepNavigation from './StepNavigation';
import SubmitBtn from './SubmitBtn';
import { Button } from '@/components/ui/button';

const MediaStepForm = (props: FormStepProps) => {
  const { updateStore } = useAuctionFormStore();

  const auctionFormData = useStore(useAuctionFormStore, (state) =>
    state.getStore(),
  );

  const { nextStep } = props;

  const saveStep = async (data: AuctionFormMedia) => {
    updateStore(data);
    nextStep();
  };

  const mediaForm = useForm({
    resolver: zodResolver(auctionFormMediaSchema),
    defaultValues: {
      imageUrls: auctionFormData?.imageUrls ?? [],
    },
  });

  const { formState, setValue } = mediaForm;

  const { isSubmitSuccessful } = formState;

  const initialImages = mapImagesToUrls(auctionFormData?.imageUrls);

  const [images, setImages] = useState<UploadImage[]>(initialImages || []);
  const [allImagesUploaded, setAllImagesUploaded] = useState(false);

  useEffect(() => {
    const initialImages = mapImagesToUrls(auctionFormData?.imageUrls);

    setImages(initialImages || []);
  }, [auctionFormData?.imageUrls]);

  useEffect(() => {
    const publicUrls = images
      .filter((image) => image.publicUrl)
      .map((image) => image.publicUrl!);
    setValue('imageUrls', publicUrls);

    if (isSubmitSuccessful) {
      updateStore({ imageUrls: publicUrls });
    }

    const areAllImagesUploaded = images.every(
      (image) => image.publicUrl !== undefined,
    );
    setAllImagesUploaded(areAllImagesUploaded);
  }, [images, setValue, isSubmitSuccessful, updateStore]);

  const handleAddImageUrl = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images.length >= 8) {
      alert('You can only submit up to 8 images.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const imageUrl = formData.get('imageUrl') as string;
    if (!imageUrl) return;

    const newImages = [
      ...images,
      {
        id: nanoid(),
        file: undefined,
        previewUrl: imageUrl,
        publicUrl: imageUrl,
      },
    ];

    setImages(newImages);
    e.currentTarget.reset();
  };

  return (
    <>
      <div className='flex h-full flex-1 flex-col justify-between'>
        <div className='flex flex-col gap-3'>
          <form className='flex gap-2' onSubmit={handleAddImageUrl}>
            <Input placeholder='image url' type='url' name='imageUrl' />
            <Button
              variant='outline'
              type='submit'
              disabled={images.length >= 8}
            >
              add
            </Button>
          </form>
          <ImageDropzone
            {...{
              images,
              setImages,
              allImagesUploaded,
            }}
          />
        </div>

        <ImageForm
          {...{
            mediaForm,
            saveStep,
            allImagesUploaded,
            ...props,
          }}
        />
      </div>
    </>
  );
};

export default MediaStepForm;

type ImageDropzoneProps = {
  images: UploadImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadImage[]>>;
  allImagesUploaded: boolean;
};
const ImageDropzone = ({
  images,
  setImages,
  allImagesUploaded,
}: ImageDropzoneProps) => {
  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _fileRejections: FileRejection[],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _event: DropEvent,
    ) => {
      if (images.length + acceptedFiles.length > 8) {
        alert('You can only submit up to 8 images.');
        return;
      }

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
    [setImages, images],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxSize: 1024 * 1000, // 1MB
    maxFiles: 8,
    onDrop,
  });

  const uploadImages = async () => {
    const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const endpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;

    if (!API_KEY || !endpoint) {
      console.error(
        'Missing CLOUDINARY_API_KEY or CLOUDINARY_UPLOAD_URL env variable',
      );
      return;
    }

    const updatedImages = await Promise.all(
      images.map(async (image) => {
        if (!image.file || image.publicUrl) return image;
        return uploadImageToCloudinary({ image, endpoint, API_KEY });
      }),
    );

    setImages(updatedImages);
  };
  return (
    <form action={uploadImages} className='flex flex-col gap-4'>
      <div {...getRootProps()} className='flex cursor-pointer flex-col'>
        <label htmlFor='files' className='sr-only pb-3 text-sm'>
          Images
        </label>
        <input {...getInputProps({ name: 'file' })} />
        <div className='relative flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-4 text-center text-black '>
          {images.length === 0 ? (
            <>
              <ArrowUpFromLine />
              <p>Drag & drop files here, or click to select files</p>
              <p className='text-center text-sm text-neutral-400'>
                Auctions with images are more likely to sell. Add up to 8 images
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
  );
};

type ImageFormProps = {
  mediaForm: UseFormReturn<{
    imageUrls: string[];
  }>;
  saveStep: (data: AuctionFormMedia) => Promise<void>;
  allImagesUploaded: boolean;
  currentStep: Step;
  nextStep: () => void;
  prevStep: () => void;
};
const ImageForm = ({
  mediaForm,
  saveStep,
  allImagesUploaded,
  currentStep,
  prevStep,
}: ImageFormProps) => {
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = mediaForm;

  return (
    <Form {...mediaForm}>
      <form
        className='flex w-full flex-col items-stretch justify-between'
        onSubmit={handleSubmit(saveStep)}
      >
        <FormField
          control={control}
          name='imageUrls'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} type='hidden' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepNavigation
          disabled={!allImagesUploaded || isSubmitting}
          currentStep={currentStep}
          prevStep={prevStep}
        />
      </form>
    </Form>
  );
};

type CreateFormDataForImageParams = {
  image: UploadImage;
  signature: string;
  timestamp: number;
  API_KEY: string;
};

const createFormDataForImage = ({
  image,
  signature,
  timestamp,
  API_KEY,
}: CreateFormDataForImageParams) => {
  if (!image.file) {
    console.error('Missing image file');
    return;
  }
  const formData = new FormData();
  formData.append('file', image.file);
  formData.append('api_key', API_KEY);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp.toString());
  formData.append('folder', 'crazy_auction');
  return formData;
};

type UploadImageParams = {
  image: UploadImage;
  endpoint: string;
  API_KEY: string;
};

const uploadImageToCloudinary = async ({
  image,
  endpoint,
  API_KEY,
}: UploadImageParams) => {
  const { signature, timestamp } = await getCloudinarySignature();
  const formData = createFormDataForImage({
    image,
    signature,
    timestamp,
    API_KEY,
  });

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const { public_id, secure_url } = await res.json();
    if (public_id && secure_url) {
      return { ...image, publicUrl: secure_url };
    }
  } catch (error) {
    console.error('Upload failed for image:', image.id, error);
  }

  return image;
};

const mapImagesToUrls = (url: string[] | undefined) => {
  if (!url) return;

  return url.map((url) => ({
    id: nanoid(),
    file: undefined,
    previewUrl: url,
    publicUrl: url,
  }));
};

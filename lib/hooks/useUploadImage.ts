import { useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { uploadToCloudinary } from '@/lib/server/actions';
import { AuctionForm } from '@/lib/services/postListing';

const useUploadImage = () => {
  const [imagesUploading, setImagesUploading] = useState(false);

  type HandleUploadParams = {
    field: ControllerRenderProps<AuctionForm, 'images'>;
  };

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

      setImagesUploading(false);
      return res;
    } catch (error) {
      console.error('Error uploading images', error);
      setImagesUploading(false);
      return [''];
    }
  };

  type HandleSelectImageParams = {
    event: React.ChangeEvent<HTMLInputElement>;
    field: ControllerRenderProps<AuctionForm, 'images'>;
    images: string[];
  };

  const handleSelectImage = async ({
    event,
    field,
    images,
  }: HandleSelectImageParams) => {
    const files = event.target.files;

    if (images.length + files?.length! > 8) {
      console.log('Too many files');
      alert('You can only upload a total of 8 images, please remove some.');
      event.target.value = '';
      return;
    }

    field.onChange(files);
  };

  const handleAddLink = async ({ link }: { link: string }) => {
    setImagesUploading(true);

    try {
      const res = await fetch(link);
      if (!res.ok) {
        console.error('Error fetching image');
        setImagesUploading(false);
        return;
      }

      if (!res.headers.get('content-type')?.startsWith('image')) {
        console.error('Not an image');
        setImagesUploading(false);
        return;
      }

      setImagesUploading(false);

      return link;
    } catch (error) {
      console.error('Error fetching image', error);
      setImagesUploading(false);
      return;
    }
  };

  return {
    handleUploadImage,
    imagesUploading,
    handleSelectImage,
    handleAddLink,
  };
};

export default useUploadImage;

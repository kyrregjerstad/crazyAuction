import { singleAuctionSchema, UpdateAuctionForm } from '@/lib/schemas';

import auctionAPIFetcher from './auctionAPIFetcher';
import { getSession } from 'next-auth/react';

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

type Params = {
  formData: UpdateAuctionForm;
  id: string;
};

export const updateAuction = async ({ formData, id }: Params) => {
  const session = await getSession();
  const jwt = session?.user?.accessToken;
  const transformedMediaLinks = formData.imageUrls?.map(
    (url) => `${workerUrl}/cache/${url}`,
  ); // add cloud_flare worker url to cache the image, in order to reduce cloud_inary costs

  const transformedFormData = {
    title: formData.title,
    description: formData.description,
    media: transformedMediaLinks,
    tags: formData.tags,
  };

  try {
    const res = await auctionAPIFetcher({
      endpoint: `/listings/${id}`,
      schema: singleAuctionSchema,
      jwt,
      method: 'PUT',
      body: transformedFormData,
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export type UpdateAuction = typeof updateAuction;

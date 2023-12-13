import { singleAuctionSchema, AuctionFormComplete } from '@/lib/schemas';
import { getSession } from 'next-auth/react';
import auctionAPIFetcher from './auctionAPIFetcher';

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

type Params = {
  formData: AuctionFormComplete;
};

export const postAuction = async ({ formData }: Params) => {
  const session = await getSession();
  const jwt = session?.user?.accessToken;
  const transformedMediaLinks = formData.imageUrls.map(
    (url) => `${workerUrl}/cache/${url}`,
  ); // add cloudFlare worker url to cache the image, in order to reduce cloudinary costs

  const transformedFormData = {
    title: formData.title,
    description: formData.description,
    media: transformedMediaLinks,
    tags: formData.tags,
    endsAt: formData.dateTime,
  };

  try {
    const res = await auctionAPIFetcher({
      endpoint: `/listings`,
      schema: singleAuctionSchema,
      method: 'POST',
      jwt,
      body: transformedFormData,
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

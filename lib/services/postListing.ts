import { singleListingSchema } from '@/lib/schemas/listingSchema';
import { getSession } from 'next-auth/react';
import { AuctionFormComplete } from '@/lib/schemas/auctionSchema';
import auctionAPIFetcher from './auctionAPIFetcher';

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

type Params = {
  formData: AuctionFormComplete;
};

const postListing = async ({ formData }: Params) => {
  const session = await getSession();
  const jwt = session?.user?.accessToken;
  const transformedMediaLinks = formData.imageUrls.map(
    (url) => `${workerUrl}/cache/${url}`,
  ); // add cloudFlare worker url to cache the image, in order to reduce cloudinary costs

  const tagsArr = formData.tags?.split(' ').map((tag) => tag.trim()) || [];

  const transformedFormData = {
    title: formData.title,
    description: formData.description,
    media: transformedMediaLinks,
    tags: tagsArr,
    endsAt: formData.dateTime,
  };

  try {
    const res = await auctionAPIFetcher({
      endpoint: `/listings`,
      schema: singleListingSchema,
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

export default postListing;

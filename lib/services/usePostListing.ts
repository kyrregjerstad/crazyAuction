import { API_AUCTION_LISTINGS_URL } from '@/lib/constants';
import { singleListingSchema } from '@/lib/schemas/listing';
import { createZodFetcher } from 'zod-fetch';

import { useClientJWT } from '../hooks/useClientJWT';
import { AuctionFormComplete } from './postListing';

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

const fetchWithZod = createZodFetcher();

type Params = {
  formData: AuctionFormComplete;
};

const usePostListing = () => {
  const { getJWT } = useClientJWT();

  const postListing = async ({ formData }: Params) => {
    const jwt = await getJWT();
    const transformedMediaLinks = formData.imageUrls.map(
      (url) => `${workerUrl}/cache/${url}`,
    ); // add cloud_flare worker url to cache the image, in order to reduce cloud_inary costs

    const tagsArr = formData.tags?.split(' ').map((tag) => tag.trim()) || [];

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${jwt}`);

    const transformedFormData = {
      title: formData.title,
      description: formData.description,
      media: transformedMediaLinks,
      tags: tagsArr,
      endsAt: formData.dateTime.toISOString(),
    };

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(transformedFormData),
    };

    try {
      const res = await fetchWithZod(
        singleListingSchema,
        API_AUCTION_LISTINGS_URL,
        requestOptions,
      );

      return res;
    } catch (error) {
      console.error(error);
    }
  };

  return { postListing };
};

export default usePostListing;

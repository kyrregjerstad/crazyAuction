import { singleListingSchema } from '@/lib/schemas/listingSchema';
import { z } from 'zod';
import auctionAPIFetcher from './auctionAPIFetcher';
import { getSession } from 'next-auth/react';

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

export const updateAuctionSchema = z.object({
  title: z.string().min(1).max(280).optional(),
  description: z.string().min(1).max(280).optional(),
  images: z.instanceof(FileList).optional(),
  imageUrls: z.array(z.string().url()),
  tags: z.array(z.string()).max(8, 'A maximum of 8 tags are allowed'),
});

export type UpdateAuctionForm = z.infer<typeof updateAuctionSchema>;

type Params = {
  formData: UpdateAuctionForm;
  id: string;
};

const updateAuction = async ({ formData, id }: Params) => {
  const session = await getSession();
  const jwt = session?.user?.accessToken;
  const transformedMediaLinks = formData.imageUrls.map(
    (url) => `${workerUrl}/cache/${url}`,
  ); // add cloud_flare worker url to cache the image, in order to reduce cloud_inary costs

  const transformedFormData = {
    title: formData.title,
    description: formData.description,
    media: transformedMediaLinks,
    tags: formData.tags,
  };

  try {
    const res = auctionAPIFetcher({
      endpoint: `/listings/${id}`,
      schema: singleListingSchema,
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

export default updateAuction;

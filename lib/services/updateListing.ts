import { singleListingSchema } from '@/lib/schemas/listing';
import { z } from 'zod';
import auctionAPIFetcher from './auctionAPIFetcher';

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

export const updateAuctionSchema = z.object({
  title: z.string().min(1).max(280).optional(),
  description: z.string().min(1).max(280).optional(),
  images: z.instanceof(FileList).optional(),
  imageUrls: z.array(z.string().url()),
  tags: z.string().optional().optional(),
});

export type UpdateAuctionForm = z.infer<typeof updateAuctionSchema>;

type Params = {
  formData: UpdateAuctionForm;
  id: string;
  jwt: string;
};

const updateAuction = async ({ formData, id, jwt }: Params) => {
  const transformedMediaLinks = formData.imageUrls.map(
    (url) => `${workerUrl}/cache/${url}`,
  ); // add cloud_flare worker url to cache the image, in order to reduce cloud_inary costs

  const tagsArr = formData.tags?.split(' ').map((tag) => tag.trim()) || [];

  const transformedFormData = {
    title: formData.title,
    description: formData.description,
    media: transformedMediaLinks,
    tags: tagsArr,
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

export default updateAuction;

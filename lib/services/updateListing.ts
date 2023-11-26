import { API_AUCTION_LISTINGS_URL } from '@/lib/constants';
import { singleListingSchema } from '@/lib/schemas/listing';
import { createZodFetcher } from 'zod-fetch';
import { z } from 'zod';

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

const fetchWithZod = createZodFetcher();

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

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${jwt}`);

  const transformedFormData = {
    title: formData.title,
    description: formData.description,
    media: transformedMediaLinks,
    tags: tagsArr,
  };

  const url = `${API_AUCTION_LISTINGS_URL}/${id}`;

  const requestOptions = {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(transformedFormData),
  };

  try {
    const res = await fetchWithZod(singleListingSchema, url, requestOptions);

    return res;
  } catch (error) {
    console.error(error);
  }
};

export default updateAuction;

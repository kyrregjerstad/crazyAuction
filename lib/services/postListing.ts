import { API_AUCTION_LISTINGS_URL } from '@/lib/constants';
import { singleListingSchema } from '@/lib/schemas/listing';
import { createZodFetcher } from 'zod-fetch';
import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';

dayjs.extend(utc);

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

const fetchWithZod = createZodFetcher();

export const auctionFormInfoSchema = z.object({
  title: z.string().min(3).max(280),
  description: z.string().max(280).optional(),
  tags: z.string().optional(),
});

export const auctionFormMediaSchema = z.object({
  imageUrls: z.array(z.string().url()),
});

export const auctionFormDateSchema = z.object({
  dateTime: z.date(),
});

export const auctionFormSchemaComplete = z.object({
  ...auctionFormInfoSchema.shape,
  ...auctionFormMediaSchema.shape,
  ...auctionFormDateSchema.shape,
});

export type AuctionFormComplete = z.infer<typeof auctionFormSchemaComplete>;
export type AuctionFormInfo = z.infer<typeof auctionFormInfoSchema>;
export type AuctionFormMedia = z.infer<typeof auctionFormMediaSchema>;
export type AuctionFormDate = z.infer<typeof auctionFormDateSchema>;

type Params = {
  formData: AuctionFormComplete;
};

const getJWT = async () => {
  const session = await getServerSession(authOptions);
  const jwt = session?.user?.accessToken;

  if (!jwt) {
    throw new Error('No JWT found');
  }

  return jwt;
};

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

export default postListing;

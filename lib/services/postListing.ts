import authOptions from '@/app/auth/authOptions';
import { singleListingSchema } from '@/lib/schemas/listing';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import auctionAPIFetcher from './auctionAPIFetcher';
import { getSession } from 'next-auth/react';

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

export const auctionFormInfoSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title can not be shorter than 3 characters' })
    .max(280, { message: 'Title can not be longer than 280 characters' }),
  description: z
    .string()
    .max(280, { message: 'Description cannot be longer than 280 characters' })
    .optional(),
  tags: z.string().optional(),
});

export const auctionFormMediaSchema = z.object({
  imageUrls: z.array(z.string().url()),
});

export const auctionFormDateSchema = z.object({
  dateTime: z.string(),
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

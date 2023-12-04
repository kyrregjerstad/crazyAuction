import authOptions from '@/app/auth/authOptions';
import { singleListingSchema } from '@/lib/schemas/listing';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import auctionAPIFetcher from './auctionAPIFetcher';

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

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
  ); // add cloudFlare worker url to cache the image, in order to reduce cloudinary costs

  const tagsArr = formData.tags?.split(' ').map((tag) => tag.trim()) || [];

  const transformedFormData = {
    title: formData.title,
    description: formData.description,
    media: transformedMediaLinks,
    tags: tagsArr,
    endsAt: formData.dateTime.toISOString(),
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

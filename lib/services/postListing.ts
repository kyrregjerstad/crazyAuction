import { API_AUCTION_LISTINGS_URL } from '@/lib/constants';
import { singleListingSchema } from '@/lib/schemas/listing';
import { createZodFetcher } from 'zod-fetch';
import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

const fetchWithZod = createZodFetcher();

export const auctionFormSchema = z.object({
  title: z.string().min(1).max(280),
  description: z.string().min(1).max(280).optional(),
  images: z.instanceof(FileList).optional(),
  imageUrls: z.array(z.string().url()),
  tags: z.string().optional(),
  date: z.date(),
  time: z.string(),
});

export type AuctionForm = z.infer<typeof auctionFormSchema>;

type Params = {
  formData: AuctionForm;
  jwt: string;
};

const formatDate = (inputDate: Date, inputTime: string) => {
  const date = dayjs(inputDate);
  const [hours, minutes] = inputTime.split(':').map(Number);
  const adjustedDate = date.hour(hours).minute(minutes).utc();
  return adjustedDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
};

const postListing = async ({ formData, jwt }: Params) => {
  const transformedMediaLinks = formData.imageUrls.map(
    (url) => `${workerUrl}/cache/${url}`,
  ); // add cloud_flare worker url to cache the image, in order to reduce cloud_inary costs

  const tagsArr = formData.tags?.split(' ').map((tag) => tag.trim()) || [];

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${jwt}`);

  const formattedDate = formatDate(formData.date, formData.time);

  const transformedFormData = {
    title: formData.title,
    description: formData.description,
    media: transformedMediaLinks,
    tags: tagsArr,
    endsAt: formattedDate,
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

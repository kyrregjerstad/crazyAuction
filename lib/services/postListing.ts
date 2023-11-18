import { API_AUCTION_LISTINGS_URL } from '@/lib/constants';
import { singleListingSchema } from '@/lib/schemas/listing';
import { createZodFetcher } from 'zod-fetch';
import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const fetchWithZod = createZodFetcher();

export const formSchema = z.object({
  title: z.string().min(1).max(280),
  description: z.string().min(1).max(280).optional(),
  media: z.string().url().max(8).optional(),
  tags: z.string().min(1).max(8).optional(),
  date: z.date(),
  time: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

type Params = {
  formData: FormValues;
  jwt: string;
};

const formatDate = (inputDate: Date, inputTime: string) => {
  const date = dayjs(inputDate);
  const [hours, minutes] = inputTime.split(':').map(Number);
  const adjustedDate = date.hour(hours).minute(minutes).utc();
  return adjustedDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
};

const postListing = async ({ formData, jwt }: Params) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${jwt}`);

  const formattedDate = formatDate(formData.date, formData.time);

  const transformedFormData = {
    title: formData.title,
    description: formData.description,
    media: formData.media,
    tags: formData.tags,
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

import { API_AUCTION_LISTINGS_URL } from '@/lib/constants';
import { singleListingSchema } from '@/lib/schemas/listing';
import { createZodFetcher } from 'zod-fetch';

const fetchWithZod = createZodFetcher();

type Params = {
  listingId: string;
  amount: number;
  jwt: string;
};

export const placeBid = async ({ listingId, amount, jwt }: Params) => {
  try {
    return await fetchWithZod(
      singleListingSchema,
      `${API_AUCTION_LISTINGS_URL}/${listingId}/bids`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ amount: amount }),
      },
    );
  } catch (error) {
    console.error(error);
  }
};

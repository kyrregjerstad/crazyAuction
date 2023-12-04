import { singleListingSchema } from '@/lib/schemas/listing';
import auctionAPIFetcher from './auctionAPIFetcher';

type Params = {
  listingId: string;
  amount: number;
  jwt: string;
};

export const placeBid = async ({ listingId, amount, jwt }: Params) => {
  try {
    const res = await auctionAPIFetcher({
      endpoint: `/listings/${listingId}/bids`,
      schema: singleListingSchema,
      jwt,
      body: {
        amount,
      },
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

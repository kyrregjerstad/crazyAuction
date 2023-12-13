import { singleAuctionSchema } from '@/lib/schemas';
import auctionAPIFetcher from './auctionAPIFetcher';

type Params = {
  listingId: string;
  amount: number;
  jwt: string;
};

export const postBid = async ({ listingId, amount, jwt }: Params) => {
  try {
    const res = await auctionAPIFetcher({
      endpoint: `/listings/${listingId}/bids`,
      schema: singleAuctionSchema,
      jwt,
      method: 'POST',
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

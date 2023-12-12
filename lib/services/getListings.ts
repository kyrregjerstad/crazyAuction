import { allListingsSchema } from '../schemas/listingSchema';
import auctionAPIFetcher from './auctionAPIFetcher';
import { Sort, Order } from './types';

type Params = {
  sort?: Sort;
  sortOrder?: Order;
  active?: boolean;
  limit?: number;
  offset?: number;
};

export const getListings = async ({
  sort = 'created',
  sortOrder = 'desc',
  active = true,
  limit,
  offset,
}: Params) => {
  try {
    const res = await auctionAPIFetcher({
      endpoint: '/listings',
      schema: allListingsSchema,
      queryParams: {
        _seller: true,
        _bids: true,
        _active: active,
        sort,
        sortOrder,
        limit,
        offset,
      },
    });

    const sortedRes = res.map((listing) => {
      const bids = listing.bids.sort((a, b) => {
        return b.amount - a.amount;
      });

      return {
        ...listing,
        bids,
      };
    });

    return sortedRes;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

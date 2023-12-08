import { allListingsSchema } from '../schemas/listing';
import auctionAPIFetcher from './auctionAPIFetcher';
import { Sort, Order } from './types';

type Params = {
  sort?: Sort;
  order?: Order;
  active?: boolean;
  limit?: number;
  offset?: number;
};

export const getAllListings = async ({
  sort = 'created',
  order: sortOrder = 'desc',
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
        order: sortOrder,
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

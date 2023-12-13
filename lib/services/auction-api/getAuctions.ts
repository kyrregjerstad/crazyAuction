import { allListingsSchema } from '../../schemas/listingSchema';
import auctionAPIFetcher from './auctionAPIFetcher';
import { Sort, Order, QueryParams } from './types';

export const getAuctions = async ({
  sort = 'created',
  sortOrder = 'desc',
  _active = true,
  limit,
  offset,
}: QueryParams) => {
  try {
    const res = await auctionAPIFetcher({
      endpoint: '/listings',
      schema: allListingsSchema,
      queryParams: {
        _seller: true,
        _bids: true,
        _active,
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

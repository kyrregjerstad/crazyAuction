import { allAuctionsSchema } from '@/lib/schemas';
import auctionAPIFetcher from './auctionAPIFetcher';
import { QueryParams } from './types';
import { normalizeResponse, sortAuctionsByPrice } from './utils';

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
      schema: allAuctionsSchema,
      queryParams: {
        _seller: true,
        _bids: true,
        _active,
        sort: sort === 'endsAt' ? 'endsAt' : 'created',
        sortOrder,
        limit,
        offset,
      },
    });

    const normalizedRes = res.map((listing) => normalizeResponse(listing));

    if (sort === 'price') {
      return sortAuctionsByPrice(normalizedRes, sortOrder);
    }

    return normalizedRes;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

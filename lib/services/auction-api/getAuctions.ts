import { allAuctionsSchema } from '@/lib/schemas';
import auctionAPIFetcher from './auctionAPIFetcher';
import { QueryParams } from './types';
import { normalizeResponse } from './utils';

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
        sort,
        sortOrder,
        limit,
        offset,
      },
    });

    return res.map((listing) => normalizeResponse(listing));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

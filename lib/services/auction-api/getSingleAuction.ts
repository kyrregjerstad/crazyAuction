import { singleAuctionSchemaExtended } from '@/lib/schemas';
import auctionAPIFetcher from './auctionAPIFetcher';
import { normalizeResponse } from './utils';

export const getSingleAuction = async (id: string) => {
  try {
    const res = await auctionAPIFetcher({
      endpoint: `/listings/${id}`,
      schema: singleAuctionSchemaExtended,
      queryParams: {
        _bids: true,
        _seller: true,
      },
    });

    return normalizeResponse(res);
  } catch (error) {
    console.error(error);
    return null;
  }
};

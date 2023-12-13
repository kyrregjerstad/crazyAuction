import { singleAuctionSchemaExtended } from '@/lib/schemas';
import auctionAPIFetcher from './auctionAPIFetcher';

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

    const sortedBids =
      res?.bids && Array.isArray(res.bids)
        ? res.bids.sort((a, b) => b.amount - a.amount)
        : [];

    const sortedRes = {
      ...res,
      bids: sortedBids,
    };

    return sortedRes;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

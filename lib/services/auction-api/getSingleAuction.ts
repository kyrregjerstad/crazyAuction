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

    const active = res?.endsAt > new Date().toISOString();
    const currentBid = sortedBids[0]?.amount || 0;

    const normalizedRes = {
      ...res,
      bids: sortedBids,
      currentBid,
      active,
    };

    return normalizedRes;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

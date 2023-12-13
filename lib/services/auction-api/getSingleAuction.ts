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

    const sortedRes = {
      ...res,
      bids: res.bids.sort((a, b) => {
        return b.amount - a.amount;
      }),
    };

    return sortedRes;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

import { singleListingSchemaExtended } from '../schemas/listingSchema';
import auctionAPIFetcher from './auctionAPIFetcher';

export const getSingleListing = async (id: string) => {
  try {
    const res = await auctionAPIFetcher({
      endpoint: `/listings/${id}`,
      schema: singleListingSchemaExtended,
      queryParams: {
        _bids: true,
        _seller: true,
      },
    });

    const sortedRes = {
      ...res,
      bids: res.bids.sort((a, b) => {
        return a.amount - b.amount;
      }),
    };

    return sortedRes;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

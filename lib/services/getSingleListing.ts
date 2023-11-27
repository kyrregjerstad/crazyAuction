import { createZodFetcher } from 'zod-fetch';
import { API_AUCTION_LISTINGS_URL } from '../constants';
import { singleListingSchemaExtended } from '../schemas/listing';
import auctionAPIFetcher from './fetcher';

const fetchWithZod = createZodFetcher();

export const getSingleListing = async (id: string) => {
  const url = `${API_AUCTION_LISTINGS_URL}/${id}?_seller=true&_bids=true`;

  try {
    auctionAPIFetcher({
      endpoint: `/listings/${id}`,
      schema: singleListingSchemaExtended,
    });
    const res = await fetchWithZod(singleListingSchemaExtended, url);

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

import { createZodFetcher } from 'zod-fetch';
import { API_AUCTION_LISTINGS_URL } from '../constants';
import { singleListingSchema } from '../schemas/listing';

const fetchWithZod = createZodFetcher();

export const getSingleListing = async (id: string) => {
  try {
    return await fetchWithZod(
      singleListingSchema,
      `${API_AUCTION_LISTINGS_URL}/${id}?_seller=true&_bids=true`,
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

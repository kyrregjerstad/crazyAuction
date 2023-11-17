import { createZodFetcher } from 'zod-fetch';
import { API_AUCTION_LISTINGS_URL } from '../constants';
import { allListingsSchema } from '../schemas/listing';

const fetchWithZod = createZodFetcher();

export const getAllListings = async () => {
  try {
    return await fetchWithZod(
      allListingsSchema,
      `${API_AUCTION_LISTINGS_URL}?_seller=true&_bids=true&_active=true&sort=created`,
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

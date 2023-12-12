import { ListingFull } from '../schemas/listingSchema';
import { getListings } from './getListings';
import { Sort, Order } from './types';

type Params = {
  sort?: Sort;
  order?: Order;
  active?: boolean;
  limit?: number;
  offset?: number;
};

const fetchAllListings = async ({
  sort = 'created',
  order: sortOrder = 'desc',
  limit = 100,
  offset = 0,
}: Params): Promise<ListingFull[]> => {
  try {
    const listings = await getListings({
      sort,
      sortOrder: sortOrder,
      limit,
      offset,
    });
    if (listings.length < limit) {
      // checks if the number of listings returned is less than the limit
      return listings;
    }

    // Recursively fetch the next page
    const nextListings = await fetchAllListings({
      sort,
      order: sortOrder,
      limit,
      offset: offset + limit,
    });
    return [...listings, ...nextListings];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Wrapper function to fetch all listings
export const getAllListings = async (params: Params) => {
  return fetchAllListings(params);
};

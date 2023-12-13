import { ListingFull } from '../../schemas/listingSchema';
import { getAuctions } from './getAuctions';
import { Sort, Order } from './types';

type Params = {
  sort?: Sort;
  order?: Order;
  active?: boolean;
  limit?: number;
  offset?: number;
};

const fetchAllAuctions = async ({
  sort = 'created',
  order: sortOrder = 'desc',
  limit = 100,
  offset = 0,
}: Params): Promise<ListingFull[]> => {
  try {
    const listings = await getAuctions({
      sort,
      sortOrder: sortOrder,
      limit,
      offset,
    });
    if (listings.length < limit) {
      return listings;
    }

    // Recursively fetch the next page
    const nextListings = await fetchAllAuctions({
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
export const getAllAuctions = async (params: Params) => {
  return fetchAllAuctions(params);
};

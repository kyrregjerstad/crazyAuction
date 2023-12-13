import { AuctionFull } from '@/lib/schemas';
import { getAuctions } from './getAuctions';
import { QueryParams } from './types';

const fetchAllAuctions = async ({
  sort = 'created',
  sortOrder = 'desc',
  limit = 100,
  offset = 0,
}: QueryParams): Promise<AuctionFull[]> => {
  try {
    const listings = await getAuctions({
      sort,
      sortOrder,
      limit,
      offset,
    });
    if (listings.length < limit) {
      return listings;
    }

    // Recursively fetch the next page
    const nextListings = await fetchAllAuctions({
      sort,
      sortOrder,
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
export const getAllAuctions = async (params: QueryParams) => {
  return fetchAllAuctions(params);
};

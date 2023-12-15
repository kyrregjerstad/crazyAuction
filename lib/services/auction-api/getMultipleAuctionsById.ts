import { getSingleAuction } from './getSingleAuction';

export const getMultipleAuctionsById = async (ids: string[]) => {
  const listingPromises = ids.map((id) =>
    getSingleAuction(id).catch((error) => {
      console.error(`Failed to fetch listing with ID ${id}:`, error);
      return null;
    }),
  );

  const results = await Promise.all(listingPromises);

  return results.filter((listing) => listing !== null);
};

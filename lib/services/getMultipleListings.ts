import { getSingleListing } from './getSingleListing';

export const getMultipleListings = async (ids: string[]) => {
  // Map over the IDs, turning each one into a fetch promise
  const listingPromises = ids.map((id) =>
    getSingleListing(id).catch((error) => {
      console.error(`Failed to fetch listing with ID ${id}:`, error);
      return null; // Return null or a custom error object to indicate failure
    }),
  );

  // Use Promise.all to execute all fetches concurrently
  const results = await Promise.all(listingPromises);

  // Filter out the nulls (failed fetches) and return only successful listings
  return results.filter((listing) => listing !== null);
};

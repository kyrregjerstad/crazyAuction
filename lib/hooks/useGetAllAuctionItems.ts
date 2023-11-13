import { SingleListing, allListingsSchema } from '../schemas/listing';

export default async function useGetAllAuctionItems() {
  const data = await fetch(
    'https://api.noroff.dev/api/v1/auction/listings?_seller=true&_bids=true',
  );
  const items = (await data.json()) as SingleListing[];

  const validation = allListingsSchema.safeParse(items);

  if (!validation.success) {
    throw new Error(validation.error.message);
  }

  return items;
}

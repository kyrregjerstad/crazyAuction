import { API_AUCTION_LISTINGS_URL } from '@/lib/constants';
import { fetcher } from '@/lib/fetcher';
import { Listing, allListingsSchema } from '@/lib/schemas/listing';

export default async function useGetAllAuctionItems() {
  const data = await fetcher<Listing[]>({
    url: `${API_AUCTION_LISTINGS_URL}?_seller=true&_bids=true`,
    schema: allListingsSchema,
  });

  return data;
}

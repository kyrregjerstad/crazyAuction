import { API_AUCTION_LISTINGS_URL } from '@/lib/constants';
import { fetcher } from '@/lib/fetcher';
import { Listing, singleListingSchema } from '@/lib/schemas/listing';

export default async function useGetSingleAuctionItem(id: string) {
  const data = await fetcher<Listing>({
    url: `${API_AUCTION_LISTINGS_URL}/${id}?_seller=true&_bids=true`,
    schema: singleListingSchema,
  });

  return data;
}

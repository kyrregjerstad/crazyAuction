import { API_AUCTION_LISTINGS_URL } from '@/lib/constants';
import { fetcher } from '@/lib/services/fetcher';
import { Listing, singleListingSchema } from '@/lib/schemas/listing';

type PlaceBid = {
  listingId: string;
  amount: number;
  jwt: string;
};

export default async function placeBid({ listingId, amount, jwt }: PlaceBid) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ amount: amount }),
  };

  const data = await fetcher<Listing>({
    url: `${API_AUCTION_LISTINGS_URL}/${listingId}/bids`,
    options,
    schema: singleListingSchema,
  });

  return data;
}

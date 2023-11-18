import { createZodFetcher } from 'zod-fetch';
import { API_AUCTION_LISTINGS_URL } from '../constants';
import { allListingsSchema } from '../schemas/listing';

const fetchWithZod = createZodFetcher();

type Sort = 'endsAt' | 'created' | 'price';
type Order = 'asc' | 'desc';

export type SearchParams = {
  sort?: Sort;
  order?: Order;
  active?: string;
};

type Params = {
  sort?: Sort;
  order?: Order;
  active?: boolean;
  limit?: number;
  offset?: number;
};

export const getAllListings = async ({
  sort = 'created',
  order: sortOrder = 'desc',
  active = true,
  limit,
  offset,
}: Params) => {
  const params = new URLSearchParams({
    _seller: 'true',
    _bids: 'true',
    _active: active.toString(),
    sort,
    sortOrder,
  });

  const url = `${API_AUCTION_LISTINGS_URL}?${params.toString()}`;

  try {
    return await fetchWithZod(allListingsSchema, url);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

import { createZodFetcher } from 'zod-fetch';
import { API_AUCTION_LISTINGS_URL } from '../constants';
import { allListingsSchema } from '../schemas/listing';

const fetchWithZod = createZodFetcher();

type Sort = 'endsAt' | 'created' | 'price';
type SortOrder = 'asc' | 'desc';

type Params = {
  sort?: Sort;
  sortOrder?: SortOrder;
  active?: boolean;
  limit?: number;
  offset?: number;
};

export const getAllListings = async ({
  sort = 'created',
  sortOrder = 'desc',
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

import { type ZodSchema } from 'zod';
import { API_BASE_URL } from '../constants';
import { createZodFetcher } from './zodFetcher';

const fetchWithZod = createZodFetcher();

type Sort = 'endsAt' | 'created' | 'price';
type Order = 'asc' | 'desc';

type QueryParams = {
  sort?: Sort;
  order?: Order;
  _active?: boolean;
  _bids?: boolean;
  _seller?: boolean;
  limit?: number;
  offset?: number;
};

type StaticEndpoints =
  | `/auth/register`
  | `/auth/login`
  | `/profiles`
  | `/listings`;

type DynamicEndpoints =
  | `/profiles/${string}`
  | `/listings/${string}/bids`
  | `/listings/${string}`;

type ApiEndpoints = StaticEndpoints | DynamicEndpoints;

const defaultQueryParams: QueryParams = {
  _seller: true,
  _bids: true,
  _active: true,
};

type Params = {
  endpoint: ApiEndpoints;
  schema: ZodSchema;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  id?: string;
  queryParams?: Partial<QueryParams>;
  jwt?: string;
};

const auctionAPIFetcher = async ({
  endpoint,
  schema,
  method = 'GET',
  queryParams,
  jwt,
}: Params) => {
  const url = new URL(API_BASE_URL + endpoint);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (jwt) {
    headers.append('Authorization', `Bearer ${jwt}`);
  }

  const options = {
    method,
    headers,
  };

  try {
    const res = await fetchWithZod(schema, url.toString(), options);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default auctionAPIFetcher;

import { type ZodSchema } from 'zod';
import { API_BASE_URL } from '../constants';
import { createZodFetcher } from './zodFetcher';
import { QueryParams, ApiEndpoints } from './types';

const fetchWithZod = createZodFetcher();

type Params<TData> = {
  endpoint: ApiEndpoints;
  schema: ZodSchema<TData, any, any>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  id?: string;
  queryParams?: Partial<QueryParams>;
  body?: any;
  jwt?: string;
};

const auctionAPIFetcher = async <TData>({
  endpoint,
  schema,
  method = 'GET',
  queryParams,
  body,
  jwt,
}: Params<TData>): Promise<TData> => {
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

  if (body) {
    body = JSON.stringify(body);
  }

  const options = {
    method,
    headers,
    body,
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

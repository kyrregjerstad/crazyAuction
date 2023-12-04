export type Sort =
  | 'endsAt'
  | 'created'
  | 'price'
  | 'name'
  | 'email'
  | 'avatar'
  | 'credits';
export type Order = 'asc' | 'desc';

export type QueryParams = {
  sort?: Sort;
  order?: Order;
  _active?: boolean;
  _bids?: boolean;
  _seller?: boolean;
  _listings?: boolean;
  limit?: number;
  offset?: number;
};

export type SearchParams = {
  sort?: Sort;
  order?: Order;
  active?: string;
};

export type StaticEndpoints =
  | `/auth/register`
  | `/auth/login`
  | `/profiles`
  | `/listings`;

export type DynamicEndpoints =
  | `/profiles/${string}`
  | `/listings/${string}/bids`
  | `/listings/${string}`;

export type ApiEndpoints = StaticEndpoints | DynamicEndpoints;

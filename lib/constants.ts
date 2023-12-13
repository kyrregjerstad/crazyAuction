import { Order, Sort } from './services/auction-api/types';

export const API_BASE_URL = 'https://api.noroff.dev/api/v1/auction';

export const API_REGISTER_URL = `${API_BASE_URL}/auth/register`;
export const API_LOGIN_URL = `${API_BASE_URL}/auth/login`;

export const API_AUCTION_LISTINGS_URL = `${API_BASE_URL}/listings`;

export const API_PROFILES_URL = `${API_BASE_URL}/profiles`;

export const searchSortOptions: {
  value: Sort;
  label: string;
  default?: boolean;
}[] = [
  { value: 'endsAt', label: 'Ending Time', default: true },
  { value: 'created', label: 'Creation Date' },
  { value: 'price', label: 'Price' },
];

export const searchOrderOptions: {
  value: Order;
  label: string;
  default?: boolean;
}[] = [
  { value: 'asc', label: 'Ascending', default: true },
  { value: 'desc', label: 'Descending' },
];

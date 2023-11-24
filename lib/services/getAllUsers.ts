import { createZodFetcher } from 'zod-fetch';
import { API_PROFILES_URL } from '../constants';
import { allUsersSchema, singleUserSchema } from '../schemas/user';

const fetchWithZod = createZodFetcher();

type Sort = 'name' | 'email' | 'avatar' | 'credits';
type Order = 'asc' | 'desc';

type Params = {
  jwt: string;
  sort?: Sort;
  order?: Order;
  limit?: number;
  offset?: number;
};

export const getAllUsers = async ({
  jwt,
  sort = 'credits',
  order: sortOrder = 'desc',
}: Params) => {
  const params = new URLSearchParams({
    sort,
    sortOrder,
    _listing: 'true',
  });

  const url = `${API_PROFILES_URL}?${params.toString()}`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  };

  try {
    const res = await fetchWithZod(allUsersSchema, url, options);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

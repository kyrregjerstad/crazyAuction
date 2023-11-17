import { createZodFetcher } from 'zod-fetch';
import { API_PROFILES_URL } from '../constants';
import { singleUserSchema } from '../schemas/user';

const fetchWithZod = createZodFetcher();

type Params = {
  username: string;
  jwt: string;
};

export const getSingleUser = async ({ username, jwt }: Params) => {
  try {
    return await fetchWithZod(
      singleUserSchema,
      `${API_PROFILES_URL}/${username}?_listings=true`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

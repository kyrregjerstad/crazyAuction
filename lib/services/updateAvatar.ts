import { API_PROFILES_URL } from '@/lib/constants';
import { createZodFetcher } from 'zod-fetch';
import { singleUserSchema } from '../schemas/user';

const fetchWithZod = createZodFetcher();

type Params = {
  name: string;
  avatar: string;
  jwt: string;
};

const updateAvatarSchema = singleUserSchema.omit({
  _count: true,
});

export const updateAvatar = async ({ avatar, name, jwt }: Params) => {
  const url = `${API_PROFILES_URL}/${name}/media`;

  const options: RequestInit = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ avatar }),
  };

  try {
    return await fetchWithZod(updateAvatarSchema, url, options);
  } catch (error) {
    console.error(error);
  }
};

import { updateAvatarSchema } from '@/lib/schemas';
import auctionAPIFetcher from './auctionAPIFetcher';

type Params = {
  name: string;
  avatar: string;
  jwt: string;
};

export const updateAvatar = async ({ avatar, name, jwt }: Params) => {
  try {
    const res = await auctionAPIFetcher({
      endpoint: `/profiles/${name}/media`,
      schema: updateAvatarSchema,
      jwt,
      method: 'PUT',
      body: {
        avatar,
      },
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

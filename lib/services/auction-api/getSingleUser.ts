import { singleUserSchema } from '../../schemas/userSchema';
import auctionAPIFetcher from './auctionAPIFetcher';

type Params = {
  username: string;
  jwt: string;
};

export const getSingleUser = async ({ username, jwt }: Params) => {
  try {
    const res = await auctionAPIFetcher({
      endpoint: `/profiles/${username}`,
      schema: singleUserSchema,
      jwt,
      queryParams: {
        _listings: true,
      },
    });

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

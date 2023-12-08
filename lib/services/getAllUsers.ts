import { allUsersSchema } from '../schemas/userSchema';
import auctionAPIFetcher from './auctionAPIFetcher';

type Sort = 'name' | 'email' | 'avatar' | 'credits';
type Order = 'asc' | 'desc';

type Params = {
  jwt: string;
  sort?: Sort;
  order?: Order;
  limit?: number;
  offset?: number;
};

const getAllUsers = async ({
  sort = 'credits',
  order: sortOrder = 'desc',
  jwt,
}: Params) => {
  try {
    const res = await auctionAPIFetcher({
      endpoint: '/profiles',
      schema: allUsersSchema,
      jwt,
      queryParams: {
        _listings: true,
        sort,
        order: sortOrder,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getAllUsers;

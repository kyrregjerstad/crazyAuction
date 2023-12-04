import { useClientJWT } from '../hooks/useClientJWT';
import { allUsersSchema } from '../schemas/user';
import auctionAPIFetcher from './auctionAPIFetcher';

type Sort = 'name' | 'email' | 'avatar' | 'credits';
type Order = 'asc' | 'desc';

type Params = {
  sort?: Sort;
  order?: Order;
  limit?: number;
  offset?: number;
};

const useGetAllUsers = ({ jwt }: { jwt: string }) => {
  const getAllUsers = async ({
    sort = 'credits',
    order: sortOrder = 'desc',
  }: Params) => {
    try {
      const res = await auctionAPIFetcher({
        endpoint: '/profiles',
        schema: allUsersSchema,
        jwt,
        queryParams: {
          _listing: true,
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

  return { getAllUsers };
};

export default useGetAllUsers;

import { allUsersSchema } from '@/lib/schemas';
import auctionAPIFetcher from './auctionAPIFetcher';
import { QueryParams } from './types';

type Params = QueryParams & {
  jwt: string;
};

export const getAllUsers = async ({
  sort = 'credits',
  sortOrder = 'desc',
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
        sortOrder,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

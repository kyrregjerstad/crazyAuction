import { voidSchema } from '@/lib/schemas/auctionSchema';
import { getSession } from 'next-auth/react';
import auctionAPIFetcher from './auctionAPIFetcher';

export const deleteAuction = async (id: string) => {
  const session = await getSession();
  const jwt = session?.user?.accessToken;

  try {
    const res = await auctionAPIFetcher({
      endpoint: `/listings/${id}`,
      schema: voidSchema,
      jwt,
      method: 'DELETE',
    });
    console.log(res);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export type UpdateAuction = typeof deleteAuction;

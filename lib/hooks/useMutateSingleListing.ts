import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { postBid } from '../services/auction-api';
import { useClientJWT } from './useClientJWT';

const useMutateSingleListing = ({ listingId }: Params) => {
  const { jwt, isSessionLoading } = useClientJWT();
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: async (newAmount: number) =>
      postBid({
        listingId,
        amount: newAmount,
        jwt: jwt || '',
      }),

    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ['singleListing', listingId],
      });
    },
  });

  return { ...query, isSessionLoading };
};

export default useMutateSingleListing;

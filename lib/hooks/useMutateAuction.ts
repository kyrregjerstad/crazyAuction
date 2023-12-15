import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { postBid, deleteAuction } from '../services/auction-api';
import { useClientJWT } from './useClientJWT';

const useMutateAuction = ({ auctionId }: Params) => {
  const { jwt, isSessionLoading } = useClientJWT();
  const queryClient = useQueryClient();

  const postBidMutation = useMutation({
    mutationFn: async (newAmount: number) =>
      postBid({
        auctionId,
        amount: newAmount,
        jwt: jwt || '',
      }),

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['singleAuction', auctionId] }),
  });

  const deleteAuctionMutation = useMutation({
    mutationFn: async () => deleteAuction(auctionId),

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['singleAuction', auctionId] }),
  });

  return { postBidMutation, deleteAuctionMutation, isSessionLoading };
};

export default useMutateAuction;

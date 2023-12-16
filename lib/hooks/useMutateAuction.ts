import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { postBid, deleteAuction } from '../services/auction-api';
import { useClientJWT } from './useClientJWT';
import { useToast } from '@/components/ui/use-toast';

const useMutateAuction = ({ auctionId }: Params) => {
  const { jwt, isSessionLoading } = useClientJWT();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const postBidMutation = useMutation({
    mutationFn: async (newAmount: number) =>
      postBid({
        auctionId,
        amount: newAmount,
        jwt: jwt || '',
      }),

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['singleAuction', auctionId] }),
    onError: (error) => {
      toast({
        title: 'Error',
        description: `There was a problem with your request. Error message: ${error.message}`,
        variant: 'error',
      });
    },
  });

  const deleteAuctionMutation = useMutation({
    mutationFn: async () => deleteAuction(auctionId),

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['singleAuction', auctionId] }),
    onError: (error) => {
      toast({
        title: 'Error',
        description: `There was a problem with your request. Error message: ${error.message}`,
        variant: 'error',
      });
    },
  });

  return { postBidMutation, deleteAuctionMutation, isSessionLoading };
};

export default useMutateAuction;

import { useQuery } from '@tanstack/react-query';
import { getSingleAuction } from '../services/auction-api/getSingleAuction';

type Params = {
  auctionId: string;
};
const useQuerySingleAuction = ({ auctionId }: Params) => {
  const query = useQuery({
    queryKey: ['singleAuction', auctionId],
    queryFn: () => getSingleAuction(auctionId),
    refetchInterval: 10000, // refetch every 10 seconds
  });

  return { ...query };
};

export default useQuerySingleAuction;

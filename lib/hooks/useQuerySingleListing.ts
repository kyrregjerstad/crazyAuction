import { useQuery } from '@tanstack/react-query';
import { getSingleAuction } from '../services/auction-api/getSingleAuction';

type Params = {
  listingId: string;
};
const useQuerySingleListing = ({ listingId }: Params) => {
  const query = useQuery({
    queryKey: ['singleListing', listingId],
    queryFn: () => getSingleAuction(listingId),
    refetchInterval: 10000, // refetch every 10 seconds
  });

  return { ...query };
};

export default useQuerySingleListing;

import { useQuery } from '@tanstack/react-query';
import { getSingleListing } from '../services/getSingleListing';

type Params = {
  listingId: string;
};
const useQuerySingleListing = ({ listingId }: Params) => {
  const query = useQuery({
    queryKey: ['singleListing', listingId],
    queryFn: () => getSingleListing(listingId),
    refetchInterval: 10000, // refetch every 10 seconds
  });

  return { ...query };
};

export default useQuerySingleListing;

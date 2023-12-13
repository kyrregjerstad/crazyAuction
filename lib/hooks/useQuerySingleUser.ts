import { useQuery } from '@tanstack/react-query';
import { getSingleUser } from '@/lib/services/auction-api';
import { useClientJWT } from './useClientJWT';

type Params = {
  username: string;
};
const useQuerySingleUser = ({ username }: Params) => {
  const { jwt, isSessionLoading } = useClientJWT();

  const query = useQuery({
    queryKey: ['userListings', username],
    queryFn: () =>
      getSingleUser({
        username: username,
        jwt: jwt || '',
      }),
    enabled: !!jwt,
  });

  const isLoading = isSessionLoading || query.isLoading;

  return { ...query, isLoading };
};

export default useQuerySingleUser;

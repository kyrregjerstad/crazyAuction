import { useQuery } from '@tanstack/react-query';
import { getSingleUser } from '../services/getSingleUser';
import { useClientJWT } from './useClientJWT';
import { useEffect, useState } from 'react';

type Params = {
  username: string;
};
const useQuerySingleUser = ({ username }: Params) => {
  const jwt = useClientJWT();
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    if (jwt) {
      setIsSessionLoading(false);
    }
  }, [jwt]);

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

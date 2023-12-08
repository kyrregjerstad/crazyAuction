import { useQuery } from '@tanstack/react-query';
import getAllUsers from '../services/getAllUsers';
import { useClientJWT } from './useClientJWT';

const useQueryAllUsers = () => {
  const { jwt, isSessionLoading } = useClientJWT();

  const query = useQuery({
    queryKey: ['allUsers'],
    queryFn: () =>
      getAllUsers({
        jwt: jwt || '',
      }),
    enabled: !!jwt,
  });

  const isLoading = isSessionLoading || query.isLoading;

  return { ...query, isLoading };
};

export default useQueryAllUsers;

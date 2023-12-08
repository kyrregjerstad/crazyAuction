import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const useClientJWT = () => {
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const session = useSession({
    required: true,
    onUnauthenticated() {
      return { redirect: '/login' };
    },
  });

  const jwt = session.data?.user.accessToken;

  useEffect(() => {
    if (session.data?.user.accessToken) {
      setIsSessionLoading(false);
    }
  }, [session.data?.user.accessToken]);

  return { jwt, isSessionLoading };
};

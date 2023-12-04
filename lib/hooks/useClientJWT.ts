import { getSession } from 'next-auth/react';

export const useClientJWT = () => {
  const getJWT = async () => {
    const session = await getSession();
    const jwt = session?.user?.accessToken;

    if (!jwt) {
      throw new Error('No JWT found');
    }

    return jwt;
  };

  return { getJWT };
};

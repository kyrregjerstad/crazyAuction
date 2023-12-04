import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export const useClientJWT = () => {
  const getJWT = async () => {
    const session = await getSession();
    const jwt = session?.user?.accessToken;

    if (!jwt) {
      console.error('No JWT found, redirecting to login');
      redirect('/login');
    }

    return jwt;
  };

  return { getJWT };
};

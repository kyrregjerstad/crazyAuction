import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export const useClientJWT = () => {
  const session = useSession();
  const jwt = session?.data?.user?.accessToken;

  if (!jwt) {
    console.error('No JWT found, redirecting to login');
    redirect('/auth/login');
  }

  return jwt;
};

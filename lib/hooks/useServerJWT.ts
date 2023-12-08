import authOptions from '@/app/(auth)/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const useServerJWT = async () => {
  'use server';
  const sessions = await getServerSession(authOptions);

  const jwt = sessions?.user?.accessToken;

  if (!jwt) {
    console.error('No JWT found, redirecting to login');
    redirect('/login');
  }

  return jwt;
};

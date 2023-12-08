import { useSession } from 'next-auth/react';

export const useClientJWT = () => {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      return { redirect: '/login' };
    },
  });
  return session.data?.user.accessToken;
};

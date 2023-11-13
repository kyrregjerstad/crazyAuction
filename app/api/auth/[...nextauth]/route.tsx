import { API_LOGIN_URL } from '@/lib/constants';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import type { JWT } from 'next-auth/jwt';

interface CustomJWT extends JWT {
  accessToken: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const res = await fetch(API_LOGIN_URL, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });
        const user = await res.json();

        if (res.ok && user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      const customToken = token as CustomJWT;

      if (user) {
        customToken.accessToken = user.accessToken;
      }
      return customToken;
    },

    session: async ({ session, token }) => {
      const customToken = token as CustomJWT;

      if (token?.accessToken) {
        session.user.accessToken = customToken.accessToken;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };

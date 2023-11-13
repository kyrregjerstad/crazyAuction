import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    name: string;
    email: string;
    avatar?: string;
    accessToken: string;
  }

  interface Session {
    user: User;
  }
}

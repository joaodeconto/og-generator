import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      id?: string;
      provider?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    provider?: string;
  }
}
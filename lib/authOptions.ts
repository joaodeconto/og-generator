import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import LinkedinProvider from 'next-auth/providers/linkedin';
import TwitterProvider from 'next-auth/providers/twitter';
import FacebookProvider from 'next-auth/providers/facebook';
import InstagramProvider from 'next-auth/providers/instagram';
import type { Provider } from 'next-auth/providers';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  INSTAGRAM_CLIENT_ID,
  INSTAGRAM_CLIENT_SECRET,
  NEXTAUTH_SECRET,
} from './env';


/**
 * Shared NextAuth configuration. This file centralises the providers and other
 * options so they can be reused in both the API route and server components
 * via `getServerSession`.
 */
const providers: Provider[] = [
  GoogleProvider({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    authorization: { params: { prompt: 'consent', access_type: 'offline', response_type: 'code' } }
  }),
  GithubProvider({
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
  }),
  LinkedinProvider({
    clientId: LINKEDIN_CLIENT_ID,
    clientSecret: LINKEDIN_CLIENT_SECRET,
    authorization: { params: { scope: 'openid profile email' } }
  }),
];

if (TWITTER_CONSUMER_KEY && TWITTER_CONSUMER_SECRET) {
  providers.push(
    TwitterProvider({
      clientId: TWITTER_CONSUMER_KEY,
      clientSecret: TWITTER_CONSUMER_SECRET,
      version: '1.0A',
    })
  );
}

if (FACEBOOK_CLIENT_ID && FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
    })
  );
}

if (INSTAGRAM_CLIENT_ID && INSTAGRAM_CLIENT_SECRET) {
  providers.push(
    InstagramProvider({
      clientId: INSTAGRAM_CLIENT_ID,
      clientSecret: INSTAGRAM_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers,
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    // Include user id and provider in the token
    async jwt({ token, account, user }) {
      if (account) {
        token.provider = account.provider;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }
      return session;
    }
  }
};
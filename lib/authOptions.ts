import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import LinkedinProvider from 'next-auth/providers/linkedin';
import TwitterProvider from 'next-auth/providers/twitter';
import FacebookProvider from 'next-auth/providers/facebook';
import InstagramProvider from 'next-auth/providers/instagram';

/**
 * Shared NextAuth configuration. This file centralises the providers and other
 * options so they can be reused in both the API route and server components
 * via `getServerSession`.
 */
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ''
    }),
    LinkedinProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID ?? '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? ''
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CONSUMER_KEY ?? '',
      clientSecret: process.env.TWITTER_CONSUMER_SECRET ?? '',
      version: '1.0A'
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? ''
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID ?? '',
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET ?? ''
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
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
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Twitter from "next-auth/providers/twitter";
import Facebook from "next-auth/providers/facebook";
import { env } from "./env";

export const providers: any[] = [];

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({ clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET })
  );
}

if (env.GITHUB_ID && env.GITHUB_SECRET) {
  providers.push(
    GitHub({ clientId: env.GITHUB_ID, clientSecret: env.GITHUB_SECRET })
  );
}

if (env.TWITTER_CLIENT_ID && env.TWITTER_CLIENT_SECRET) {
  providers.push(
    Twitter({ clientId: env.TWITTER_CLIENT_ID, clientSecret: env.TWITTER_CLIENT_SECRET })
  );
}

if (env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    Facebook({ clientId: env.FACEBOOK_CLIENT_ID, clientSecret: env.FACEBOOK_CLIENT_SECRET })
  );
}

export const { handlers, auth } = NextAuth({
  providers,
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) (session as any).userId = token.sub;
      return session;
    },
  },
});

import { z } from "zod";

const clean = (v?: string) => (v?.trim() ? v.trim() : undefined);

const base = z.object({
  // Provide a default secret so builds/dev server don't crash when the variable
  // is missing. Real deployments should always override this with a secure
  // value via NEXTAUTH_SECRET.
  NEXTAUTH_SECRET: z.string().min(1).default("dev-secret"),
  NEXTAUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
  TWITTER_CONSUMER_KEY: z.string().optional(),
  TWITTER_CONSUMER_SECRET: z.string().optional(),
  TWITTER_CLIENT_ID: z.string().optional(),
  TWITTER_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),
  INSTAGRAM_CLIENT_ID: z.string().optional(),
  INSTAGRAM_CLIENT_SECRET: z.string().optional(),
});

export const env = base.parse({
  NEXTAUTH_SECRET: clean(process.env.NEXTAUTH_SECRET),
  NEXTAUTH_URL: clean(process.env.NEXTAUTH_URL),

  GOOGLE_CLIENT_ID: clean(process.env.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: clean(process.env.GOOGLE_CLIENT_SECRET),
  GITHUB_ID: clean(process.env.GITHUB_ID),
  GITHUB_SECRET: clean(process.env.GITHUB_SECRET),

  TWITTER_CONSUMER_KEY: clean(process.env.TWITTER_CONSUMER_KEY),
  TWITTER_CONSUMER_SECRET: clean(process.env.TWITTER_CONSUMER_SECRET),
  TWITTER_CLIENT_ID: clean(process.env.TWITTER_CLIENT_ID),
  TWITTER_CLIENT_SECRET: clean(process.env.TWITTER_CLIENT_SECRET),

  FACEBOOK_CLIENT_ID: clean(process.env.FACEBOOK_CLIENT_ID),
  FACEBOOK_CLIENT_SECRET: clean(process.env.FACEBOOK_CLIENT_SECRET),
  INSTAGRAM_CLIENT_ID: clean(process.env.INSTAGRAM_CLIENT_ID),
  INSTAGRAM_CLIENT_SECRET: clean(process.env.INSTAGRAM_CLIENT_SECRET),
});

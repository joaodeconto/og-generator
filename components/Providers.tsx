"use client";

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { PropsWithChildren } from 'react';

/**
 * Global providers used by the app. Includes NextAuth's SessionProvider and any other
 * client-side context providers. You can add additional providers here (e.g. ThemeProvider).
 */
export default function Providers({ children, session }: PropsWithChildren<{ session?: Session | null }>) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
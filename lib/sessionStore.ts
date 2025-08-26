import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from 'next-auth';

interface SessionState {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

/**
 * Global session store so auth info is accessible outside of the NextAuth context
 * and survives page reloads. Stored in localStorage via Zustand's persist middleware.
 */
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    {
      name: 'session-store',
    }
  )
);

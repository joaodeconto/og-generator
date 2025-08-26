"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { useSessionStore } from '../lib/sessionStore';
/**
 * Renders sign in/out controls. When authenticated it shows the user's avatar
 * with a dropdown menu containing the sign-out action. The current session is
 * persisted to a Zustand store so other components can access it without the
 * NextAuth context.
 */
export default function AuthButtons() {
  const { data: session, status } = useSession();
  const setSession = useSessionStore((s) => s.setSession);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSession(session);
  }, [session, setSession]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open]);

  if (status === 'loading') {
    return (
      <div className="space-x-3">
        <Button type="button" disabled aria-busy="true" variant="secondary" className="flex items-center justify-center px-4 py-2">
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="sr-only">Carregando</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {session ? (
        <>
          <span className="text-sm font-medium">Olá, {session.user?.name || 'usuário'}</span>
          <Button onClick={() => signOut()} variant="secondary">
            Sair
          </Button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none"
          >
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user?.name ?? 'avatar'}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-700">
                {(session.user?.name ?? 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </button>
          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-32 rounded-md border bg-white shadow-lg"
            >
              <button
                role="menuitem"
                onClick={() => signOut()}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Sair
              </button>
            </div>
          )}
        </>
      ) : (
        <Button onClick={() => signIn()}>
          Entrar
        </Button>
      )}
    </div>
  );
}

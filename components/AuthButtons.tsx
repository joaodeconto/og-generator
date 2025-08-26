"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

/**
 * Renders sign in/out buttons based on the user's session state. When not
 * authenticated the user can choose one of the available providers on the
 * default NextAuth sign in page.
 */
export default function AuthButtons() {
  const { data: session, status } = useSession();

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
    <div className="space-x-3">
      {session ? (
        <>
          <span className="text-sm font-medium">Olá, {session.user?.name || 'usuário'}</span>
          <Button onClick={() => signOut()} variant="secondary">
            Sair
          </Button>
        </>
      ) : (
        <Button onClick={() => signIn()}>
          Entrar
        </Button>
      )}
    </div>
  );
}
"use client";

import { signIn, signOut, useSession } from 'next-auth/react';

/**
 * Renders sign in/out buttons based on the user's session state. When not
 * authenticated the user can choose one of the available providers on the
 * default NextAuth sign in page.
 */
export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  return (
    <div className="space-x-3">
      {session ? (
        <>
          <span className="text-sm font-medium">Olá, {session.user?.name || 'usuário'}</span>
          <button
            onClick={() => signOut()}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Sair
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Entrar
        </button>
      )}
    </div>
  );
}
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
    return (
      <div className="space-x-3">
        <button
          type="button"
          className="flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
          disabled
          aria-busy="true"
        >
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
        </button>
      </div>
    );
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
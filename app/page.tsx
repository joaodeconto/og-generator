"use client";

import CanvasStage from 'components/CanvasStage';
import EditorControls from 'components/EditorControls';
import ExportControls from 'components/ExportControls';
import AuthButtons from 'components/AuthButtons';
import PresetsPanel from 'components/PresetsPanel';
import MetadataPanel from 'components/MetadataPanel';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();
  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">OG Image Studio</h1>
        <AuthButtons />
      </header>
      <section className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <EditorControls />
          <div className="mt-6">
            <ExportControls />
          </div>
        </div>
        <div>
          <CanvasStage />
          <p className="mt-4 text-xs text-gray-500">
            Faça login para persistir suas criações e desbloquear funcionalidades avançadas.
          </p>
        </div>
        <div>
          <PresetsPanel />
          <div className="mt-6">
            <MetadataPanel />
          </div>
        </div>
      </section>
    </main>
  );
}
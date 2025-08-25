"use client";

import { useEditorStore } from 'lib/editorStore';
import { buildMetaTags } from 'lib/metaTags';

export default function ExportPanel() {
  const { title, subtitle } = useEditorStore();

  const handleCopyMeta = () => {
    const tags = buildMetaTags({ title, description: subtitle });
    navigator.clipboard.writeText(tags).catch(console.error);
  };

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <button className="btn">1200×630</button>
        <button className="btn">1600×900</button>
        <button className="btn">1920×1005</button>
      </div>
      <button className="btn btn-primary w-full">Export PNG</button>
      <button className="btn w-full" onClick={handleCopyMeta}>Copy Meta</button>
    </section>
  );
}

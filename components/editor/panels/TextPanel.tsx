"use client";
export default function TextPanel() {
  return (
    <section className="space-y-3">
      <label className="block">
        <span className="text-sm">Title</span>
        <input className="mt-1 w-full rounded-lg border bg-background px-3 py-2" placeholder="Your awesome title" />
      </label>
      <label className="block">
        <span className="text-sm">Subtitle</span>
        <textarea className="mt-1 w-full rounded-lg border bg-background px-3 py-2" rows={3} placeholder="Short description" />
      </label>
      <div className="grid grid-cols-3 gap-2">
        <button className="btn">XS</button>
        <button className="btn">MD</button>
        <button className="btn">XL</button>
      </div>
    </section>
  );
}

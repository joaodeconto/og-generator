"use client";
export default function LogoPanel() {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <input type="file" accept="image/png,image/svg+xml" />
        <button className="btn">Paste</button>
        <button className="btn">From URL</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button className="btn">Remove BG</button>
        <button className="btn">Invert B/W</button>
        <button className="btn">Mask: Circle</button>
      </div>
      <div>
        <label className="text-sm">Scale</label>
        <input type="range" min={0.2} max={3} step={0.01} className="w-full" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="btn">Reset</button>
        <button className="btn">Center</button>
      </div>
    </section>
  );
}

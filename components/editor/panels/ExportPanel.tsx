"use client";
export default function ExportPanel() {
  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <button className="btn">1200×630</button>
        <button className="btn">1600×900</button>
        <button className="btn">1920×1005</button>
      </div>
      <button className="btn btn-primary w-full">Export PNG</button>
      <button className="btn w-full">Copy Meta</button>
    </section>
  );
}

"use client";
export default function ExportPanel() {
  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <button className="btn" aria-label="Export size 1200 by 630">
          1200×630
        </button>
        <button className="btn" aria-label="Export size 1600 by 900">
          1600×900
        </button>
        <button className="btn" aria-label="Export size 1920 by 1005">
          1920×1005
        </button>
      </div>
      <button className="btn btn-primary w-full" aria-label="Export image as PNG">
        Export PNG
      </button>
      <button className="btn w-full" aria-label="Copy meta tags">
        Copy Meta
      </button>
    </section>
  );
}

"use client";
export default function LogoPanel() {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <label htmlFor="logo-upload" className="sr-only">
          Upload logo
        </label>
        <input
          id="logo-upload"
          type="file"
          accept="image/png,image/svg+xml"
        />
        <button className="btn" aria-label="Paste logo from clipboard">
          Paste
        </button>
        <button className="btn" aria-label="Load logo from URL">
          From URL
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button className="btn" aria-label="Remove background from logo">
          Remove BG
        </button>
        <button className="btn" aria-label="Invert logo colors">
          Invert B/W
        </button>
        <button className="btn" aria-label="Mask logo as circle">
          Mask: Circle
        </button>
      </div>
      <div>
        <label htmlFor="logo-scale" className="text-sm">
          Scale
        </label>
        <input
          id="logo-scale"
          type="range"
          min={0.2}
          max={3}
          step={0.01}
          className="w-full"
          aria-labelledby="logo-scale"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="btn" aria-label="Reset logo adjustments">
          Reset
        </button>
        <button className="btn" aria-label="Center logo on canvas">
          Center
        </button>
      </div>
    </section>
  );
}

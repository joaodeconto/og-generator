"use client";
import { useEditorStore } from "lib/editorStore";

const SIZE_PRESETS = {
  "1200x630": { width: 1200, height: 630 },
  "1600x900": { width: 1600, height: 900 },
  "1920x1005": { width: 1920, height: 1005 },
};

export default function CanvasPanel() {
  const {
    theme,
    setTheme,
    layout,
    setLayout,
    vertical,
    setVertical,
    accentColor,
    setAccentColor,
    width,
    height,
    setSize,
  } = useEditorStore();

  const current = (Object.entries(SIZE_PRESETS).find(
    ([, v]) => v.width === width && v.height === height
  ) || ["", { width: 0, height: 0 }])[0];

  return (
    <section className="space-y-3">
      <div>
        <span className="text-sm" id="theme-label">
          Theme
        </span>
        <div className="mt-1 flex gap-4" role="radiogroup" aria-labelledby="theme-label">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
              className="h-4 w-4"
            />
            Light
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
              className="h-4 w-4"
            />
            Dark
          </label>
        </div>
      </div>

      <label className="block">
        <span className="text-sm">Horizontal</span>
        <select
          className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
          value={layout}
          onChange={(e) => setLayout(e.target.value as "left" | "center" | "right")}
          aria-label="Horizontal Alignment"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm">Vertical</span>
        <select
          className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
          value={vertical}
          onChange={(e) => setVertical(e.target.value as "top" | "center" | "bottom")}
          aria-label="Vertical Alignment"
        >
          <option value="top">Top</option>
          <option value="center">Center</option>
          <option value="bottom">Bottom</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm">Accent Color</span>
        <input
          type="color"
          className="mt-1 h-8 w-full rounded-lg border bg-background p-1"
          value={accentColor}
          onChange={(e) => setAccentColor(e.target.value)}
          aria-label="Accent Color"
        />
      </label>

      <div>
        <span className="text-sm" id="size-label">
          Size
        </span>
        <div
          className="mt-1 grid grid-cols-3 gap-2"
          role="group"
          aria-labelledby="size-label"
        >
          {Object.entries(SIZE_PRESETS).map(([key, value]) => (
            <button
              key={key}
              className={`btn ${current === key ? "btn-primary" : ""}`}
              aria-label={`Canvas size ${key.replace("x", " by ")}`}
              aria-pressed={current === key}
              onClick={() => setSize(value.width, value.height)}
            >
              {key.replace("x", "×")}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

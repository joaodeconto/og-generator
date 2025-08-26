"use client";
import { useEditorStore } from "lib/editorStore";
import useProcessedLogo from "lib/hooks/useProcessedLogo";
import type { ChangeEvent } from "react";

export default function LogoPanel() {
  const {
    setLogoFile,
    setLogoUrl,
    toggleRemoveLogoBg,
    toggleInvertLogo,
    toggleMaskLogo,
    logoScale,
    setLogoScale,
    logoPosition,
    setLogoPosition,
    logoFile,
    logoUrl,
    removeLogoBg,
    invertLogo,
  } = useEditorStore();

  const { loading } = useProcessedLogo({
    logoFile,
    logoUrl,
    removeLogoBg,
    invertLogo,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoFile(file);
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && "read" in navigator.clipboard) {
        // @ts-error ClipboardItem type
        const items = await navigator.clipboard.read();
        for (const item of items) {
          // @ts-error ClipboardItem types
          const type = item.types.find((t: string) => t.startsWith("image/"));
          if (type) {
            // @ts-error ClipboardItem getType
            const blob = await item.getType(type);
            const file = new File([blob], "pasted-image" + type.replace("image/", "."), { type });
            setLogoFile(file);
            return;
          }
        }
      }
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text.startsWith("http")) {
          setLogoUrl(text);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUrl = () => {
    const url = prompt("Image URL");
    if (url) setLogoUrl(url);
  };

  const handleReset = () => {
    setLogoScale(1);
    setLogoPosition(50, 50);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          id="logo-upload"
          type="file"
          accept="image/png,image/svg+xml"
          onChange={handleFileChange}
          aria-label="Upload logo file"
          className="hidden"
        />
        <label htmlFor="logo-upload" className="btn">
          Choose File
        </label>
        <button className="btn" aria-label="Paste logo from clipboard" onClick={handlePaste}>
          Paste
        </button>
        <button className="btn" aria-label="Load logo from URL" onClick={handleUrl}>
          From URL
        </button>
      </div>
      {loading && (
        <div
          role="status"
          aria-label="Processing logo"
          className="flex items-center"
        >
          <svg
            className="animate-spin h-5 w-5 text-current"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        <button className="btn" aria-label="Remove background from logo" onClick={toggleRemoveLogoBg}>
          Remove BG
        </button>
        <button className="btn" aria-label="Invert logo colors" onClick={toggleInvertLogo}>
          Invert B/W
        </button>
        <button className="btn" aria-label="Mask logo as circle" onClick={toggleMaskLogo}>

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
          value={logoScale}
          onChange={(e) => setLogoScale(parseFloat(e.target.value))}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="logo-x" className="text-sm">
            X
          </label>
          <input
            id="logo-x"
            type="number"
            min={0}
            max={100}
            className="w-full"
            value={logoPosition.x}
            onChange={(e) => setLogoPosition(parseFloat(e.target.value), logoPosition.y)}
          />
        </div>
        <div>
          <label htmlFor="logo-y" className="text-sm">
            Y
          </label>
          <input
            id="logo-y"
            type="number"
            min={0}
            max={100}
            className="w-full"
            value={logoPosition.y}
            onChange={(e) => setLogoPosition(logoPosition.x, parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div>
        <label htmlFor="logo-y" className="text-sm">
          Y Position
        </label>
        <input
          id="logo-y"
          type="range"
          min={0}
          max={100}
          step={1}
          className="w-full"
          value={logoPosition.y}
          onChange={(e) =>
            setLogoPosition(logoPosition.x, parseFloat(e.target.value))
          }
        />
      </div>
      <div>
        <label htmlFor="logo-x" className="text-sm">
          X Position
        </label>
        <input
          id="logo-x"
          type="range"
          min={0}
          max={100}
          step={1}
          className="w-full"
          value={logoPosition.x}
          onChange={(e) =>
            setLogoPosition(parseFloat(e.target.value), logoPosition.y)
          }
        />
      </div>
      <div>
        <button className="btn" aria-label="Reset logo adjustments" onClick={handleReset}>
          Reset
        </button>
      </div>
    </section>
  );
}

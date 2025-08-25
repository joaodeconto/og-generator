"use client";
import { useEditorStore } from "lib/editorStore";
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
    setLogoPosition,
  } = useEditorStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoFile(file);
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && "read" in navigator.clipboard) {
        // @ts-ignore ClipboardItem type
        const items = await navigator.clipboard.read();
        for (const item of items) {
          // @ts-ignore ClipboardItem types
          const type = item.types.find((t: string) => t.startsWith("image/"));
          if (type) {
            // @ts-ignore ClipboardItem getType
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

  const handleCenter = () => {
    setLogoPosition(50, 50);
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/png,image/svg+xml"
          onChange={handleFileChange}
          aria-label="Logo file"
        />
        <button className="btn" onClick={handlePaste}>
          Paste
        </button>
        <button className="btn" onClick={handleUrl}>
          From URL
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button className="btn" onClick={toggleRemoveLogoBg}>
          Remove BG
        </button>
        <button className="btn" onClick={toggleInvertLogo}>
          Invert B/W
        </button>
        <button className="btn" onClick={toggleMaskLogo}>
          Mask: Circle
        </button>
      </div>
      <div>
        <label className="text-sm" htmlFor="logo-scale">
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
        <button className="btn" onClick={handleReset}>
          Reset
        </button>
        <button className="btn" onClick={handleCenter}>
          Center
        </button>
      </div>
    </section>
  );
}

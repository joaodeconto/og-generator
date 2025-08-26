"use client";
import { useEditorStore } from "lib/editorStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ChangeEvent } from "react";
import type { CSSProperties } from "react";

type TextFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  rows: number;
  fontSize: number;
  min: number;
  max: number;
  onChange: (value: string) => void;
};

function TextField({
  label,
  placeholder,
  value,
  rows,
  fontSize,
  min,
  max,
  onChange,
}: TextFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const style: CSSProperties & { textWrap?: string } = {
    fontSize: `clamp(${min}px, ${fontSize}px, ${max}px)`,
    textWrap: "balance",
  };

  return (
    <label className="block">
      <span className="text-sm">{label}</span>
      <textarea
        className="mt-1 w-full rounded-lg border bg-background px-3 py-2"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        style={style}
      />
    </label>
  );
}
export default function TextPanel() {
  const {
    title,
    subtitle,
    titleFontSize,
    subtitleFontSize,
    setTitle,
    setSubtitle,
    setTitleFontSize,
    setSubtitleFontSize,
  } = useEditorStore();

  const applySize = (size: "xs" | "md" | "xl") => {
    const presets = {
      xs: { title: 32, subtitle: 16 },
      md: { title: 48, subtitle: 24 },
      xl: { title: 64, subtitle: 32 },
    } as const;
    setTitleFontSize(presets[size].title);
    setSubtitleFontSize(presets[size].subtitle);
  };

  return (
    <section className="space-y-3">
      <label className="block">
        <span className="text-sm">Title</span>
        <Input
          className="mt-1"
          placeholder="Your awesome title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-sm">Subtitle</span>
        <Textarea
          className="mt-1"
          rows={3}
          placeholder="Short description"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
      </label>
      <TextField
        label="Title"
        placeholder="Your awesome title"
        value={title}
        rows={2}
        fontSize={titleFontSize}
        min={32}
        max={96}
        onChange={setTitle}
      />
      <TextField
        label="Subtitle"
        placeholder="Short description"
        value={subtitle}
        rows={3}
        fontSize={subtitleFontSize}
        min={16}
        max={48}
        onChange={setSubtitle}
      />
      <div className="grid grid-cols-3 gap-2">
        <Button aria-label="Extra small title size" onClick={() => applySize("xs")}>
          XS
        </Button>
        <Button aria-label="Medium title size" onClick={() => applySize("md")}>
          MD
        </Button>
        <Button aria-label="Extra large title size" onClick={() => applySize("xl")}>
          XL
        </Button>
      </div>
    </section>
  );
}

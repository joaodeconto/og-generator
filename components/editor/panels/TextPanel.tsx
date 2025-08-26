"use client";
import { useEditorStore } from "lib/editorStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function TextPanel() {
  const {
    title,
    subtitle,
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

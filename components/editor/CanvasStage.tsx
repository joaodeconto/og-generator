"use client";
import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "lib/editorStore";

export default function CanvasStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const base = { w: 1200, h: 630 };
  const {
    title,
    subtitle,
    titleFontSize,
    subtitleFontSize,
    theme,
    layout,
    accentColor,
  } = useEditorStore();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = el;
      const scale = Math.min(clientWidth / base.w, clientHeight / base.h);
      setZoom(scale * 0.98);
      draw();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme === "dark" ? "#0b0c0f" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
    ctx.font = `bold ${titleFontSize}px system-ui, -apple-system, Segoe UI, Roboto`;
    const titleX = layout === "center" ? canvas.width / 2 : 64;
    const subtitleX = titleX;
    ctx.textAlign = layout === "center" ? "center" : "left";
    ctx.fillText(title || "OGGenerator — Title", titleX, 180);
    ctx.font = `${subtitleFontSize}px system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.fillStyle = accentColor;
    ctx.fillText(subtitle || "Subtitle goes here", subtitleX, 240);
  };

  useEffect(() => {
    draw();
  }, [zoom, theme, layout, accentColor, title, subtitle, titleFontSize, subtitleFontSize]);

  return (
    <div ref={containerRef} className="flex h-full w-full items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={base.w}
        height={base.h}
        style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
      />
    </div>
  );
}

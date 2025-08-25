"use client";
import { useEffect, useRef, useState } from "react";

export default function CanvasStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const base = { w: 1200, h: 630 };

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
    ctx.fillStyle = "#0b0c0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 48px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText("OGGenerator — Title", 64, 180);
    ctx.font = "24px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillStyle = "#D1D5DB";
    ctx.fillText("Subtitle goes here", 64, 240);
  };

  useEffect(() => {
    draw();
  }, [zoom]);

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

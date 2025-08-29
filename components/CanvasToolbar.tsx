"use client";

import { useCallback } from "react";
import { useEditorStore } from "lib/editorStore";
import { Button } from "@/components/ui/button";

export default function CanvasToolbar() {
  const {
    // global
    autoLayout,
    setAutoLayout,
    snapToGuides,
    setSnapToGuides,
    undo,
    redo,
    reset,
    // selection
    selected,
    // text props
    titleFontSize,
    subtitleFontSize,
    setTitleFontSize,
    setSubtitleFontSize,
    titleAlign,
    subtitleAlign,
    setTitleAlign,
    setSubtitleAlign,
    titleRotation,
    subtitleRotation,
    setTitleRotation,
    setSubtitleRotation,
    // logo props
    logoScale,
    setLogoScale,
    logoRotation,
    setLogoRotation,
    toggleLogoFlipX,
    toggleLogoFlipY,
    toggleRemoveLogoBg,
    toggleInvertLogo,
    toggleMaskLogo,
  } = useEditorStore();

  const toggleAuto = useCallback(() => setAutoLayout(!autoLayout), [autoLayout, setAutoLayout]);
  const toggleSnap = useCallback(() => setSnapToGuides(!snapToGuides), [snapToGuides, setSnapToGuides]);

  const incTextSize = useCallback((delta: number) => {
    if (selected === 'title') setTitleFontSize(Math.max(8, titleFontSize + delta));
    else if (selected === 'subtitle') setSubtitleFontSize(Math.max(6, subtitleFontSize + delta));
  }, [selected, titleFontSize, subtitleFontSize, setTitleFontSize, setSubtitleFontSize]);

  const setAlign = useCallback((align: 'left' | 'center' | 'right') => {
    if (selected === 'title') setTitleAlign(align);
    else if (selected === 'subtitle') setSubtitleAlign(align);
  }, [selected, setTitleAlign, setSubtitleAlign]);

  const rotateText = useCallback((delta: number) => {
    if (selected === 'title') setTitleRotation((titleRotation ?? 0) + delta);
    else if (selected === 'subtitle') setSubtitleRotation((subtitleRotation ?? 0) + delta);
  }, [selected, titleRotation, subtitleRotation, setTitleRotation, setSubtitleRotation]);

  const resetTextRotation = useCallback(() => {
    if (selected === 'title') setTitleRotation(0);
    else if (selected === 'subtitle') setSubtitleRotation(0);
  }, [selected, setTitleRotation, setSubtitleRotation]);

  const scaleLogo = useCallback((delta: number) => {
    setLogoScale(Math.max(0.1, Math.min(5, logoScale + delta)));
  }, [logoScale, setLogoScale]);

  const rotateLogo = useCallback((delta: number) => setLogoRotation((logoRotation ?? 0) + delta), [logoRotation, setLogoRotation]);
  const resetLogoAdjust = useCallback(() => { setLogoScale(1); setLogoRotation(0); }, [setLogoScale, setLogoRotation]);

  return (
    <div
      className="absolute top-2 right-2 z-10 flex items-center gap-2 rounded-md border bg-background/80 px-2 py-1 text-sm shadow backdrop-blur"
      role="toolbar"
      aria-label="Canvas tools"
      aria-hidden="true"
    >
      <Button size="sm" variant="secondary" onClick={undo} aria-label="Undo">
        Undo
      </Button>
      <Button size="sm" variant="secondary" onClick={redo} aria-label="Redo">
        Redo
      </Button>
      <div className="h-5 w-px bg-border" aria-hidden="true" />
      <Button size="sm" variant={autoLayout ? "default" : "secondary"} onClick={toggleAuto} aria-pressed={autoLayout} aria-label="Toggle auto layout">
        Auto layout
      </Button>
      <Button size="sm" variant={snapToGuides ? "default" : "secondary"} onClick={toggleSnap} aria-pressed={snapToGuides} aria-label="Toggle snapping guides">
        Snap
      </Button>
      <Button size="sm" variant="secondary" onClick={reset} aria-label="Reset canvas">
        Reset
      </Button>

      <div className="h-5 w-px bg-border" aria-hidden="true" />
      {selected !== 'logo' && (
        <div className="flex items-center gap-1">
          <span className="px-1 text-xs opacity-70">{selected === 'title' ? 'Title' : 'Subtitle'}</span>
          <Button size="sm" variant="secondary" onClick={() => incTextSize(-2)} aria-label={`Decrease ${selected} size`}>
            A-
          </Button>
          <Button size="sm" variant="secondary" onClick={() => incTextSize(2)} aria-label={`Increase ${selected} size`}>
            A+
          </Button>
          <div className="h-5 w-px bg-border" aria-hidden="true" />
          <Button size="sm" variant={((selected === 'title' ? titleAlign : subtitleAlign) ?? 'left') === 'left' ? 'default' : 'secondary'} onClick={() => setAlign('left')} aria-label={`Align ${selected} left`}>
            L
          </Button>
          <Button size="sm" variant={((selected === 'title' ? titleAlign : subtitleAlign) ?? 'left') === 'center' ? 'default' : 'secondary'} onClick={() => setAlign('center')} aria-label={`Align ${selected} center`}>
            C
          </Button>
          <Button size="sm" variant={((selected === 'title' ? titleAlign : subtitleAlign) ?? 'left') === 'right' ? 'default' : 'secondary'} onClick={() => setAlign('right')} aria-label={`Align ${selected} right`}>
            R
          </Button>
          <div className="h-5 w-px bg-border" aria-hidden="true" />
          <Button size="sm" variant="secondary" onClick={() => rotateText(-10)} aria-label={`Rotate ${selected} left`}>
            ↺
          </Button>
          <Button size="sm" variant="secondary" onClick={() => rotateText(10)} aria-label={`Rotate ${selected} right`}>
            ↻
          </Button>
          <Button size="sm" variant="secondary" onClick={resetTextRotation} aria-label={`Reset ${selected} rotation`}>
            Reset rot
          </Button>
        </div>
      )}

      {selected === 'logo' && (
        <div className="flex items-center gap-1">
          <span className="px-1 text-xs opacity-70">Logo</span>
          <Button size="sm" variant="secondary" onClick={() => scaleLogo(-0.1)} aria-label="Decrease logo scale">
            -
          </Button>
          <Button size="sm" variant="secondary" onClick={() => scaleLogo(0.1)} aria-label="Increase logo scale">
            +
          </Button>
          <div className="h-5 w-px bg-border" aria-hidden="true" />
          <Button size="sm" variant="secondary" onClick={() => rotateLogo(-15)} aria-label="Rotate logo left">
            ↺
          </Button>
          <Button size="sm" variant="secondary" onClick={() => rotateLogo(15)} aria-label="Rotate logo right">
            ↻
          </Button>
          <div className="h-5 w-px bg-border" aria-hidden="true" />
          <Button size="sm" variant="secondary" onClick={toggleLogoFlipX} aria-label="Flip logo horizontally">
            Flip X
          </Button>
          <Button size="sm" variant="secondary" onClick={toggleLogoFlipY} aria-label="Flip logo vertically">
            Flip Y
          </Button>
          <div className="h-5 w-px bg-border" aria-hidden="true" />
          <Button size="sm" variant="secondary" onClick={toggleRemoveLogoBg} aria-label="Toggle remove logo background">
            BG-
          </Button>
          <Button size="sm" variant="secondary" onClick={toggleInvertLogo} aria-label="Toggle invert logo colors">
            Invert
          </Button>
          <Button size="sm" variant="secondary" onClick={toggleMaskLogo} aria-label="Toggle mask logo circle">
            Mask
          </Button>
          <Button size="sm" variant="secondary" onClick={resetLogoAdjust} aria-label="Reset logo adjustments">
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}

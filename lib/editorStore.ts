import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Preset } from './randomStyle';

// State without actions for history snapshots
export interface EditorData {
  title: string;
  subtitle: string;
  titleFontSize: number;
  subtitleFontSize: number;
  // Text container widths (percentage of canvas width)
  titleBoxWidthPct?: number;
  subtitleBoxWidthPct?: number;
  // Text styling
  titleFontFamily?: string;
  subtitleFontFamily?: string;
  titleFontWeight?: number;
  subtitleFontWeight?: number;
  titleColor?: string;
  subtitleColor?: string;
  titleLineHeight?: number;
  subtitleLineHeight?: number;
  titleLetterSpacing?: number;
  subtitleLetterSpacing?: number;
  titleAlign?: 'left' | 'center' | 'right';
  subtitleAlign?: 'left' | 'center' | 'right';
  // Rotation for objects
  titleRotation?: number; // degrees
  subtitleRotation?: number;
  logoRotation?: number;
  logoFlipX?: boolean;
  logoFlipY?: boolean;
  titlePosition: { x: number; y: number };
  subtitlePosition: { x: number; y: number };
  theme: 'light' | 'dark';
  layout: 'left' | 'center' | 'right';
  vertical: 'top' | 'center' | 'bottom';
  accentColor: string;
  background: string;
  width: number;
  height: number;
  bannerUrl?: string;
  logoFile?: File;
  logoUrl?: string;
  logoPosition: { x: number; y: number };
  logoScale: number;
  invertLogo: boolean;
  removeLogoBg: boolean;
  maskLogo: boolean;
  presets: Preset[];
  // layout helpers / flags
  autoLayout?: boolean;
  freezeSizeOnDrag?: boolean;
  snapToGuides?: boolean;
  selected?: 'title' | 'subtitle' | 'logo';
  // UI transient flags
  resizingTitleBox?: boolean;
  resizingSubtitleBox?: boolean;
}

export interface EditorState extends EditorData {
  setTitle: (value: string) => void;
  setSubtitle: (value: string) => void;
  setTitleFontSize: (size: number) => void;
  setSubtitleFontSize: (size: number) => void;
  setTitleBoxWidthPct: (pct: number) => void;
  setSubtitleBoxWidthPct: (pct: number) => void;
  setTitleFontFamily: (family: string) => void;
  setSubtitleFontFamily: (family: string) => void;
  setTitleFontWeight: (weight: number) => void;
  setSubtitleFontWeight: (weight: number) => void;
  setTitleColor: (color: string) => void;
  setSubtitleColor: (color: string) => void;
  setTitleLineHeight: (lh: number) => void;
  setSubtitleLineHeight: (lh: number) => void;
  setTitleLetterSpacing: (ls: number) => void;
  setSubtitleLetterSpacing: (ls: number) => void;
  setTitleAlign: (align: 'left' | 'center' | 'right') => void;
  setSubtitleAlign: (align: 'left' | 'center' | 'right') => void;
  setTitleRotation: (deg: number) => void;
  setSubtitleRotation: (deg: number) => void;
  setLogoRotation: (deg: number) => void;
  toggleLogoFlipX: () => void;
  toggleLogoFlipY: () => void;
  setTitlePosition: (x: number, y: number, commit?: boolean) => void;
  setSubtitlePosition: (x: number, y: number, commit?: boolean) => void;
  setTheme: (value: 'light' | 'dark') => void;
  setLayout: (value: 'left' | 'center' | 'right') => void;
  setVertical: (value: 'top' | 'center' | 'bottom') => void;
  setAccentColor: (value: string) => void;
  setBackground: (value: string) => void;
  setBannerUrl: (value: string | undefined) => void;
  setLogoFile: (file: File | undefined) => void;
  setLogoUrl: (url: string | undefined) => void;
  setLogoPosition: (x: number, y: number, commit?: boolean) => void;
  setLogoScale: (scale: number) => void;
  toggleInvertLogo: () => void;
  toggleRemoveLogoBg: () => void;
  toggleMaskLogo: () => void;
  setSize: (width: number, height: number) => void;
  addPreset: (preset: Preset) => void;
  applyPreset: (preset: Preset) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  // load a full snapshot (e.g., from API)
  loadDesign: (data: EditorData) => void;
  setAutoLayout: (enabled: boolean) => void;
  toggleFreezeSizeOnDrag: () => void;
  setSnapToGuides: (enabled: boolean) => void;
  setSelected: (sel: 'title' | 'subtitle' | 'logo') => void;
  setResizingTitleBox: (resizing: boolean) => void;
  setResizingSubtitleBox: (resizing: boolean) => void;
}

const initialState: EditorData = {
  title: '',
  subtitle: '',
  titleFontSize: 72,
  subtitleFontSize: 36,
  titleBoxWidthPct: 60,
  subtitleBoxWidthPct: 70,
  titleFontFamily: 'Inter, ui-sans-serif, system-ui',
  subtitleFontFamily: 'Inter, ui-sans-serif, system-ui',
  titleFontWeight: 700,
  subtitleFontWeight: 400,
  titleColor: undefined,
  subtitleColor: undefined,
  titleLineHeight: 1.1,
  subtitleLineHeight: 1.3,
  titleLetterSpacing: 0,
  subtitleLetterSpacing: 0,
  titleAlign: undefined,
  subtitleAlign: undefined,
  titleRotation: 0,
  subtitleRotation: 0,
  logoRotation: 0,
  logoFlipX: false,
  logoFlipY: false,
  titlePosition: { x: 50, y: 50 },
  subtitlePosition: { x: 50, y: 50 },
  theme: 'light',
  layout: 'left',
  vertical: 'center',
  accentColor: '#3b82f6',
  background: '#ffffff',
  width: 1200,
  height: 630,
  logoPosition: { x: 50, y: 50 },
  logoScale: 1,
  invertLogo: false,
  removeLogoBg: false,
  maskLogo: false,
  presets: [],
  autoLayout: false,
  freezeSizeOnDrag: true,
  snapToGuides: true,
  selected: 'title',
  resizingTitleBox: false,
  resizingSubtitleBox: false,
};

export const serializeEditorState = (state: EditorState | EditorData): string => {
  const { logoFile, ...data } = state;
  void logoFile;
  return JSON.stringify(data);
};

export const deserializeEditorState = (json: string): EditorData => {
  const data = JSON.parse(json) as Partial<EditorData>;
  return { ...initialState, ...data };
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => {
      const past: EditorData[] = [];
      const future: EditorData[] = [];

      const stripActions = ({
        title,
        subtitle,
        titleFontSize,
        subtitleFontSize,
        titleFontFamily,
        subtitleFontFamily,
        titleFontWeight,
        subtitleFontWeight,
        titleColor,
        subtitleColor,
        titleLineHeight,
        subtitleLineHeight,
        titleLetterSpacing,
        subtitleLetterSpacing,
        titleAlign,
        subtitleAlign,
        titleRotation,
        subtitleRotation,
        logoRotation,
        logoFlipX,
        logoFlipY,
        titlePosition,
        subtitlePosition,
        theme,
        layout,
        vertical,
        accentColor,
        background,
        width,
        height,
        bannerUrl,
        logoFile,
        logoUrl,
        logoPosition,
        logoScale,
        invertLogo,
        removeLogoBg,
        maskLogo,
        presets,
        autoLayout,
        freezeSizeOnDrag,
        snapToGuides,
        selected,
        resizingTitleBox,
        resizingSubtitleBox,
      }: EditorState): EditorData => ({
        title,
        subtitle,
        titleFontSize,
        subtitleFontSize,
        titleFontFamily,
        subtitleFontFamily,
        titleFontWeight,
        subtitleFontWeight,
        titleColor,
        subtitleColor,
        titleLineHeight,
        subtitleLineHeight,
        titleLetterSpacing,
        subtitleLetterSpacing,
        titleAlign,
        subtitleAlign,
        titleRotation,
        subtitleRotation,
        logoRotation,
        logoFlipX,
        logoFlipY,
        titlePosition,
        subtitlePosition,
        theme,
        layout,
        vertical,
        accentColor,
        background,
        width,
        height,
        bannerUrl,
        logoFile,
        logoUrl,
        logoPosition,
        logoScale,
        invertLogo,
        removeLogoBg,
        maskLogo,
        presets,
        autoLayout,
        freezeSizeOnDrag,
        snapToGuides,
        selected,
        resizingTitleBox,
        resizingSubtitleBox,
      });

      const patch = (partial: Partial<EditorData>) =>
        set((state) => ({ ...state, ...partial }));

      const apply = (partial: Partial<EditorData>) =>
        set((state) => {
          past.push(stripActions(state));
          future.length = 0;
          return { ...state, ...partial };
        });

      return {
        ...initialState,
        setTitle: (value) => apply({ title: value }),
        setSubtitle: (value) => apply({ subtitle: value }),
        setTitleFontSize: (size) => apply({ titleFontSize: size }),
        setSubtitleFontSize: (size) => apply({ subtitleFontSize: size }),
        setTitleBoxWidthPct: (pct) => apply({ titleBoxWidthPct: Math.min(100, Math.max(10, Math.round(pct))) }),
        setSubtitleBoxWidthPct: (pct) => apply({ subtitleBoxWidthPct: Math.min(100, Math.max(10, Math.round(pct))) }),
        setTitleFontFamily: (family) => apply({ titleFontFamily: family }),
        setSubtitleFontFamily: (family) => apply({ subtitleFontFamily: family }),
        setTitleFontWeight: (weight) => apply({ titleFontWeight: weight }),
        setSubtitleFontWeight: (weight) => apply({ subtitleFontWeight: weight }),
        setTitleColor: (color) => apply({ titleColor: color }),
        setSubtitleColor: (color) => apply({ subtitleColor: color }),
        setTitleLineHeight: (lh) => apply({ titleLineHeight: lh }),
        setSubtitleLineHeight: (lh) => apply({ subtitleLineHeight: lh }),
        setTitleLetterSpacing: (ls) => apply({ titleLetterSpacing: ls }),
        setSubtitleLetterSpacing: (ls) => apply({ subtitleLetterSpacing: ls }),
        setTitleAlign: (align) => apply({ titleAlign: align }),
        setSubtitleAlign: (align) => apply({ subtitleAlign: align }),
        setTitleRotation: (deg) => apply({ titleRotation: deg }),
        setSubtitleRotation: (deg) => apply({ subtitleRotation: deg }),
        setLogoRotation: (deg) => apply({ logoRotation: deg }),
        toggleLogoFlipX: () => apply({ logoFlipX: !get().logoFlipX }),
        toggleLogoFlipY: () => apply({ logoFlipY: !get().logoFlipY }),
        setTitlePosition: (x, y, commit = true) =>
          (commit ? apply : patch)({ titlePosition: { x, y } }),
        setSubtitlePosition: (x, y, commit = true) =>
          (commit ? apply : patch)({ subtitlePosition: { x, y } }),
        setTheme: (value) => apply({ theme: value }),
        setLayout: (value) => apply({ layout: value }),
        setVertical: (value) => apply({ vertical: value }),
        setAccentColor: (value) => apply({ accentColor: value }),
        setBackground: (value) => apply({ background: value }),
        setSize: (width, height) => apply({ width, height }),
        setBannerUrl: (value) => apply({ bannerUrl: value }),
        setLogoFile: (file) => apply({ logoFile: file, logoUrl: undefined }),
        setLogoUrl: (url) => apply({ logoUrl: url, logoFile: undefined }),
        setLogoPosition: (x, y, commit = true) =>
          (commit ? apply : patch)({ logoPosition: { x, y } }),
        setLogoScale: (scale) => apply({ logoScale: scale }),
        toggleInvertLogo: () => apply({ invertLogo: !get().invertLogo }),
        toggleRemoveLogoBg: () => apply({ removeLogoBg: !get().removeLogoBg }),
        toggleMaskLogo: () => apply({ maskLogo: !get().maskLogo }),
        addPreset: (preset) =>
          set((state) => ({ presets: [...state.presets, preset] })),
        applyPreset: (preset) =>
          apply({
            theme: preset.theme,
            layout: preset.layout,
            accentColor: preset.accentColor,
          }),
        undo: () =>
          set((state) => {
            const previous = past.pop();
            if (!previous) return state;
            future.push(stripActions(state));
            return { ...state, ...previous };
          }),
        redo: () =>
          set((state) => {
            const next = future.pop();
            if (!next) return state;
            past.push(stripActions(state));
            return { ...state, ...next };
          }),
        reset: () => {
          past.length = 0;
          future.length = 0;
          set(initialState);
        },
        loadDesign: (data) => {
          past.length = 0;
          future.length = 0;
          set((state) => ({ ...state, ...data }));
        },
        setAutoLayout: (enabled) => apply({ autoLayout: enabled }),
        toggleFreezeSizeOnDrag: () => apply({ freezeSizeOnDrag: !get().freezeSizeOnDrag }),
        setSnapToGuides: (enabled) => apply({ snapToGuides: enabled }),
        setSelected: (sel) => patch({ selected: sel }),
        setResizingTitleBox: (resizing) => patch({ resizingTitleBox: resizing }),
        setResizingSubtitleBox: (resizing) => patch({ resizingSubtitleBox: resizing }),
      };
    },
    {
      name: 'editor-store',
      partialize: (state) => ({
        title: state.title,
        subtitle: state.subtitle,
        titlePosition: state.titlePosition,
        subtitlePosition: state.subtitlePosition,
        titleFontSize: state.titleFontSize,
        subtitleFontSize: state.subtitleFontSize,
        titleBoxWidthPct: state.titleBoxWidthPct,
        subtitleBoxWidthPct: state.subtitleBoxWidthPct,
        titleFontFamily: state.titleFontFamily,
        subtitleFontFamily: state.subtitleFontFamily,
        titleFontWeight: state.titleFontWeight,
        subtitleFontWeight: state.subtitleFontWeight,
        titleColor: state.titleColor,
        subtitleColor: state.subtitleColor,
        titleLineHeight: state.titleLineHeight,
        subtitleLineHeight: state.subtitleLineHeight,
        titleLetterSpacing: state.titleLetterSpacing,
        subtitleLetterSpacing: state.subtitleLetterSpacing,
        titleAlign: state.titleAlign,
        subtitleAlign: state.subtitleAlign,
        titleRotation: state.titleRotation,
        subtitleRotation: state.subtitleRotation,
        logoRotation: state.logoRotation,
        logoFlipX: state.logoFlipX,
        logoFlipY: state.logoFlipY,
        theme: state.theme,
        layout: state.layout,
        vertical: state.vertical,
        accentColor: state.accentColor,
        background: state.background,
        width: state.width,
        height: state.height,
        bannerUrl: state.bannerUrl,
        logoUrl: state.logoUrl,
        logoPosition: state.logoPosition,
        logoScale: state.logoScale,
        invertLogo: state.invertLogo,
        removeLogoBg: state.removeLogoBg,
        maskLogo: state.maskLogo,
        presets: state.presets,
        autoLayout: state.autoLayout,
        freezeSizeOnDrag: state.freezeSizeOnDrag,
        snapToGuides: state.snapToGuides,
        selected: state.selected,
        // do not persist transient resizing flags
      }),
    }
  )
);

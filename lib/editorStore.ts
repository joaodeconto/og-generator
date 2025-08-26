import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Preset } from './randomStyle';

// State without actions for history snapshots
export interface EditorData {
  title: string;
  subtitle: string;
  titleFontSize: number;
  subtitleFontSize: number;
  titlePosition: { x: number; y: number };
  subtitlePosition: { x: number; y: number };
  theme: 'light' | 'dark';
  layout: 'left' | 'center' | 'right';
  vertical: 'top' | 'center' | 'bottom';
  accentColor: string;
  bannerUrl?: string;
  logoFile?: File;
  logoUrl?: string;
  logoPosition: { x: number; y: number };
  logoScale: number;
  invertLogo: boolean;
  removeLogoBg: boolean;
  maskLogo: boolean;
  presets: Preset[];
}

export interface EditorState extends EditorData {
  setTitle: (value: string) => void;
  setSubtitle: (value: string) => void;
  setTitleFontSize: (size: number) => void;
  setSubtitleFontSize: (size: number) => void;
  setTitlePosition: (x: number, y: number) => void;
  setSubtitlePosition: (x: number, y: number) => void;
  setTheme: (value: 'light' | 'dark') => void;
  setLayout: (value: 'left' | 'center' | 'right') => void;
  setVertical: (value: 'top' | 'center' | 'bottom') => void;
  setAccentColor: (value: string) => void;
  setBannerUrl: (value: string | undefined) => void;
  setLogoFile: (file: File | undefined) => void;
  setLogoUrl: (url: string | undefined) => void;
  setLogoPosition: (x: number, y: number) => void;
  setLogoScale: (scale: number) => void;
  toggleInvertLogo: () => void;
  toggleRemoveLogoBg: () => void;
  toggleMaskLogo: () => void;
  addPreset: (preset: Preset) => void;
  applyPreset: (preset: Preset) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const initialState: EditorData = {
  title: '',
  subtitle: '',
  titleFontSize: 48,
  subtitleFontSize: 24,
  titlePosition: { x: 50, y: 50 },
  subtitlePosition: { x: 50, y: 50 },
  theme: 'light',
  layout: 'left',
  vertical: 'center',
  accentColor: '#3b82f6',
  logoPosition: { x: 50, y: 50 },
  logoScale: 1,
  invertLogo: false,
  removeLogoBg: false,
  maskLogo: false,
  presets: [],
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
        titlePosition,
        subtitlePosition,
        theme,
        layout,
        vertical,
        accentColor,
        bannerUrl,
        logoFile,
        logoUrl,
        logoPosition,
        logoScale,
        invertLogo,
        removeLogoBg,
        maskLogo,
        presets,
      }: EditorState): EditorData => ({
        title,
        subtitle,
        titleFontSize,
        subtitleFontSize,
        titlePosition,
        subtitlePosition,
        theme,
        layout,
        vertical,
        accentColor,
        bannerUrl,
        logoFile,
        logoUrl,
        logoPosition,
        logoScale,
        invertLogo,
        removeLogoBg,
        maskLogo,
        presets,
      });

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
        setTitlePosition: (x, y) => apply({ titlePosition: { x, y } }),
        setSubtitlePosition: (x, y) => apply({ subtitlePosition: { x, y } }),
        setTheme: (value) => apply({ theme: value }),
        setLayout: (value) => apply({ layout: value }),
        setVertical: (value) => apply({ vertical: value }),
        setAccentColor: (value) => apply({ accentColor: value }),
        setBannerUrl: (value) => apply({ bannerUrl: value }),
        setLogoFile: (file) => apply({ logoFile: file, logoUrl: undefined }),
        setLogoUrl: (url) => apply({ logoUrl: url, logoFile: undefined }),
        setLogoPosition: (x, y) => apply({ logoPosition: { x, y } }),
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
      };
    },
    {
      name: 'editor-store',
      partialize: (state) => ({
        title: state.title,
        subtitle: state.subtitle,
        titlePosition: state.titlePosition,
        subtitlePosition: state.subtitlePosition,
        theme: state.theme,
        layout: state.layout,
        vertical: state.vertical,
        accentColor: state.accentColor,
        bannerUrl: state.bannerUrl,
        logoUrl: state.logoUrl,
        logoPosition: state.logoPosition,
        logoScale: state.logoScale,
        invertLogo: state.invertLogo,
        removeLogoBg: state.removeLogoBg,
        maskLogo: state.maskLogo,
        presets: state.presets,
      }),
    }
  )
);

import { create } from 'zustand';
import type { Preset } from './randomStyle';


/**
 * Definition of the editor's state. This store manages the current values of
 * fields used to generate an Open Graph image as well as transforms applied
 * to the uploaded logo. Individual fields are updated via dedicated setter
 * actions to make state changes predictable and easy to trace.
 */
export interface EditorState {
  title: string;
  subtitle: string;
  theme: 'light' | 'dark';
  layout: 'left' | 'center';
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
  // actions
  setTitle: (value: string) => void;
  setSubtitle: (value: string) => void;
  setTheme: (value: 'light' | 'dark') => void;
  setLayout: (value: 'left' | 'center') => void;
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
}

export const useEditorStore = create<EditorState>((set) => ({
  title: '',
  subtitle: '',
  theme: 'light',
  layout: 'left',
  accentColor: '#3b82f6',
  logoPosition: { x: 0, y: 0 },
  logoScale: 1,
  invertLogo: false,
  removeLogoBg: false,
  maskLogo: false,
  presets: [],
  setTitle: (value) => set({ title: value }),
  setSubtitle: (value) => set({ subtitle: value }),
  setTheme: (value) => set({ theme: value }),
  setLayout: (value) => set({ layout: value }),
  setAccentColor: (value) => set({ accentColor: value }),
  setBannerUrl: (value) => set({ bannerUrl: value }),
  setLogoFile: (file) => set({ logoFile: file, logoUrl: undefined }),
  setLogoUrl: (url) => set({ logoUrl: url, logoFile: undefined }),
  setLogoPosition: (x, y) => set({ logoPosition: { x, y } }),
  setLogoScale: (scale) => set({ logoScale: scale }),
  toggleInvertLogo: () => set((state) => ({ invertLogo: !state.invertLogo })),
  toggleRemoveLogoBg: () => set((state) => ({ removeLogoBg: !state.removeLogoBg })),
  toggleMaskLogo: () => set((state) => ({ maskLogo: !state.maskLogo })),
  addPreset: (preset) =>
    set((state) => ({ presets: [...state.presets, preset] })),
  applyPreset: (preset) =>
    set({
      theme: preset.theme,
      layout: preset.layout,
      accentColor: preset.accentColor
    })
}));
import { create } from 'zustand';

/**
 * Store for metadata associated with the generated Open Graph image. Keeping
 * this state in a dedicated store allows the editor state to remain focused on
 * visual customization while this store tracks scraped site information.
 */
export interface MetadataState {
  description: string;
  image: string;
  favicon: string;
  siteName: string;
  sourceMap: Record<string, string>;
  warnings: string[];
  // actions
  setDescription: (value: string) => void;
  setImage: (value: string) => void;
  setFavicon: (value: string) => void;
  setSiteName: (value: string) => void;
  setSourceMap: (value: Record<string, string>) => void;
  setWarnings: (value: string[]) => void;
}

export const useMetadataStore = create<MetadataState>((set) => ({
  description: '',
  image: '',
  favicon: '',
  siteName: '',
  sourceMap: {},
  warnings: [],
  setDescription: (value) => set({ description: value }),
  setImage: (value) => set({ image: value }),
  setFavicon: (value) => set({ favicon: value }),
  setSiteName: (value) => set({ siteName: value }),
  setSourceMap: (value) => set({ sourceMap: value }),
  setWarnings: (value) => set({ warnings: value })
}));

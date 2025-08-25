import { create } from "zustand";

interface EditorState {
  title: string;
  subtitle: string;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  title: "",
  subtitle: "",
  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle })
}));

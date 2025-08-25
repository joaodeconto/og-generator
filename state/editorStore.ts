import { create } from "zustand";

interface EditorState {
  title: string;
  subtitle: string;
  theme: "light" | "dark";
  layout: "left" | "center";
  accentColor: string;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  setLayout: (layout: "left" | "center") => void;
  setAccentColor: (accentColor: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  title: "",
  subtitle: "",
  theme: "dark",
  layout: "left",
  accentColor: "#D1D5DB",
  setTitle: (title) => set({ title }),
  setSubtitle: (subtitle) => set({ subtitle }),
  setTheme: (theme) => set({ theme }),
  setLayout: (layout) => set({ layout }),
  setAccentColor: (accentColor) => set({ accentColor })
}));

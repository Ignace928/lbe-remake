import { applyThemeVars, ThemeKey, themes } from "@/lib/theme";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Mode = "light" | "dark" | "system";

interface ThemeState {
  theme: ThemeKey;          // <-- 1 | 2 | 3 | 4 | "default"
  mode: Mode;               // <-- light/dark/system
  setTheme: (t: ThemeKey) => void;
  setMode: (m: Mode) => void;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "6",
      mode: "system",

      setTheme: (t) => {
        set({ theme: t });
        get().applyTheme();
      },

      setMode: (m) => {
        set({ mode: m });
        get().applyTheme();
      },

      applyTheme: () => {
        const { theme, mode } = get();

        // Détection système
        const prefersDark =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;

        const isDark = mode === "dark" || (mode === "system" && prefersDark);

        // 🎯 ICI : typé et sans erreur !
        const selected = isDark
          ? themes[theme].dark
          : themes[theme].light;

        applyThemeVars(selected);
      },
    }),
    { name: "app-theme" }
  )
);

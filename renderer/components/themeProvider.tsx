"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { applyTheme } = useThemeStore();

  useEffect(() => {
    // Applique le thème dès le premier rendu
    applyTheme();

    // Écoute du mode système pour mise à jour automatique
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => applyTheme();
    mql.addEventListener("change", update);

    return () => mql.removeEventListener("change", update);
  }, [applyTheme]);

  return <>{children}</>;
}

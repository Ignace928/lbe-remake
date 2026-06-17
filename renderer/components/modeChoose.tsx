"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui";

type Mode = "light" | "dark" | "system";

export default function ModeSwitcher() {
  const { mode, setMode, applyTheme } = useThemeStore();
  const [systemMode, setSystemMode] = useState<"light" | "dark">("light");

  // 🔹 Détecter le mode système
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemMode(mql.matches ? "dark" : "light");

    update(); // valeur initiale
    mql.addEventListener("change", update);

    return () => mql.removeEventListener("change", update);
  }, []);

  // 🔹 Appliquer le thème à chaque changement
  useEffect(() => {
    applyTheme();
  }, [mode, systemMode, applyTheme]);

  return (
      
        <Select value={mode} onValueChange={(m: Mode) => setMode(m)}>
          <SelectTrigger className="border border-secondary">
            <SelectValue placeholder="theme">{mode === 'light' ? (<Sun/>) : mode === 'dark' ? (<Moon/>) : (<SunMoon/>)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light<Sun/></SelectItem>
            <SelectItem value="dark">Dark<Moon/></SelectItem>
            <SelectItem value="system">System<SunMoon/></SelectItem>
          </SelectContent>
        </Select>
  );
}

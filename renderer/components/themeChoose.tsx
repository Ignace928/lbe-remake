"use client";

import { useEffect } from "react";
import { PaintbrushIcon, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui";

export default function ThemeSwitcher() {
  const { theme, setTheme,  applyTheme } = useThemeStore();
  // 🔹 Appliquer le thème à chaque changement
  useEffect(() => {
    applyTheme();
  }, [theme, applyTheme]);

  return (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full cursor-pointer w-10 h-10">
              <PaintbrushIcon/>
            </Button>
      
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="p-4 font-normal">
              <div className="flex items-center justify-center text-center gap-2 text-sm">
                Thèmes
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("1")}>
                🍃 Dusty Grass
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("2")}>
                🍊 Sunset Orange
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("3")}>
                🌸 Sakura 
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("4")}>
                ☄ Commète
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("5")}>
                ♉ Nouveau
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("6")}>
              <Sparkles/>
                N/B
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  );
}

  // {themeOrder.map((t) => (
  //   <Button
  //     key={t}
  //     onClick={() => setTheme(t)}
  //     variant={theme === t ? "default" : "outline"}
  //   >
  //     Thème {t}
  //   </Button>
  // ))}
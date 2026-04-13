"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const resolvedTheme: ThemeMode = savedTheme === "dark" ? "dark" : "light";
    setTheme(resolvedTheme);
    applyTheme(resolvedTheme);
  }, []);

  const isDark = theme === "dark";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-100/90 px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-800/80 dark:text-zinc-300">
      <Sun className="size-3.5" aria-hidden />
      <Switch
        aria-label="Toggle dark mode"
        checked={isDark}
        onCheckedChange={(checked) => {
          const nextTheme: ThemeMode = checked ? "dark" : "light";
          setTheme(nextTheme);
          localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
          applyTheme(nextTheme);
        }}
      />
      <Moon className="size-3.5" aria-hidden />
    </div>
  );
}

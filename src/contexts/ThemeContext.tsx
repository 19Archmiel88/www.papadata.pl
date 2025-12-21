import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext, type ThemeMode, type ThemeContextValue } from "./theme-context";

const STORAGE_KEY = "papadata-theme";

function readInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore (SSR/blocked storage)
  }
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => readInitialTheme());

  // apply + persist (external side effects only)
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => {
    const setTheme = (next: ThemeMode) => setThemeState(next);
    const toggleTheme = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));
    return { theme, setTheme, toggleTheme };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

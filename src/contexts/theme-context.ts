import { createContext } from "react";

export type ThemeMode = "dark" | "light";

export type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (next: ThemeMode) => void;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

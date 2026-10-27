import { createContext } from 'react';
import type { ThemeMode } from './themeMode';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

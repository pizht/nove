import { useContext } from 'react';
import { ThemeModeContext } from './themeContext';

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode 必须在 ThemeProvider 内使用');
  }

  return context;
}

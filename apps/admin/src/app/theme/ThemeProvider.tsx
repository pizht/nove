import ConfigProvider from 'antd/es/config-provider';
import theme from 'antd/es/theme';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeModeContext } from './themeContext';
import type { ThemeModeContextValue } from './themeContext';
import {
  applyThemeMode,
  isThemeMode,
  readStoredThemeMode,
  storeThemeMode,
  DEFAULT_THEME_MODE,
  THEME_CSS_VAR_CLASS,
  THEME_MODE_STORAGE_KEY,
} from './themeMode';
import type { ThemeMode } from './themeMode';

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => initialMode ?? readStoredThemeMode());

  const themeConfig = useMemo(
    () => ({
      algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      cssVar: { key: THEME_CSS_VAR_CLASS },
    }),
    [mode]
  );

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
  }, []);

  useLayoutEffect(() => {
    applyThemeMode(mode);
    storeThemeMode(mode);

    // antd 的 message / Modal.confirm 等静态方法渲染在 React 树之外，
    // 需要同步全局主题才能跟随当前亮暗模式。
    ConfigProvider.config({ theme: themeConfig });
  }, [mode, themeConfig]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_MODE_STORAGE_KEY) return;
      setModeState(isThemeMode(event.newValue) ? event.newValue : DEFAULT_THEME_MODE);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const contextValue = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      isDark: mode === 'dark',
      setMode,
      toggleMode,
    }),
    [mode, setMode, toggleMode]
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeModeContext.Provider>
  );
}

export const THEME_MODES = ['light', 'dark'] as const;

export type ThemeMode = (typeof THEME_MODES)[number];

export const DEFAULT_THEME_MODE: ThemeMode = 'light';

/**
 * localStorage 键。使用应用前缀，避免与同域其他应用的偏好互相覆盖。
 */
export const THEME_MODE_STORAGE_KEY = 'nove-admin:theme-mode';

/**
 * Ant Design CSS 变量挂载的类名。
 *
 * antd 6 的 CSS 变量默认定义在 ConfigProvider 生成的 key 类上；把同一个类名
 * 挂到 `<html>` 后，`--ant-*` 变量才能被业务自定义 CSS 读取。
 */
export const THEME_CSS_VAR_CLASS = 'nove-admin-theme';

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

export function readStoredThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_THEME_MODE;

  try {
    const storedMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
    return isThemeMode(storedMode) ? storedMode : DEFAULT_THEME_MODE;
  } catch {
    // 浏览器禁用存储时仍使用默认主题。
    return DEFAULT_THEME_MODE;
  }
}

export function storeThemeMode(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
  } catch {
    // 偏好无法持久化时，当前会话的切换仍然生效。
  }
}

export function applyThemeMode(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.dataset.theme = mode;
  root.classList.add(THEME_CSS_VAR_CLASS);
}

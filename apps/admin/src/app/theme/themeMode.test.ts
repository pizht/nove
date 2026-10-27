import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyThemeMode,
  isThemeMode,
  readStoredThemeMode,
  storeThemeMode,
  DEFAULT_THEME_MODE,
  THEME_CSS_VAR_CLASS,
  THEME_MODE_STORAGE_KEY,
} from './themeMode';

describe('themeMode', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
    document.documentElement.classList.remove(THEME_CSS_VAR_CLASS);
    vi.restoreAllMocks();
  });

  it('only accepts light and dark', () => {
    expect(isThemeMode('light')).toBe(true);
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('system')).toBe(false);
    expect(isThemeMode(null)).toBe(false);
  });

  it('reads a valid stored preference and falls back to light otherwise', () => {
    expect(readStoredThemeMode()).toBe(DEFAULT_THEME_MODE);

    storeThemeMode('dark');
    expect(readStoredThemeMode()).toBe('dark');

    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, 'system');
    expect(readStoredThemeMode()).toBe(DEFAULT_THEME_MODE);
  });

  it('keeps working when browser storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });

    expect(readStoredThemeMode()).toBe(DEFAULT_THEME_MODE);
    expect(() => storeThemeMode('dark')).not.toThrow();
    expect(setItem).toHaveBeenCalledWith(THEME_MODE_STORAGE_KEY, 'dark');
  });

  it('reflects the mode on the document for CSS and native controls', () => {
    applyThemeMode('dark');

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(document.documentElement).toHaveClass(THEME_CSS_VAR_CLASS);

    applyThemeMode('light');

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
});

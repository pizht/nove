import { act, fireEvent, render, screen } from '@testing-library/react';
import theme from 'antd/es/theme';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import { storeThemeMode, THEME_CSS_VAR_CLASS, THEME_MODE_STORAGE_KEY } from './themeMode';

function TokenProbe() {
  const { token } = theme.useToken();
  return <output data-testid="token">{token.colorBgContainer}</output>;
}

const lightBgContainer = theme.getDesignToken().colorBgContainer;
const darkBgContainer = theme.getDesignToken({
  algorithm: theme.darkAlgorithm,
}).colorBgContainer;

function renderTheme(initialMode?: 'light' | 'dark') {
  return render(
    <ThemeProvider initialMode={initialMode}>
      <TokenProbe />
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
    document.documentElement.classList.remove(THEME_CSS_VAR_CLASS);
  });

  it('applies the stored mode and the Ant Design dark algorithm', () => {
    storeThemeMode('dark');

    renderTheme();

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(document.documentElement).toHaveClass(THEME_CSS_VAR_CLASS);
    expect(screen.getByTestId('token')).toHaveTextContent(darkBgContainer);
    expect(screen.getByRole('button', { name: '切换到浅色模式' })).toBeInTheDocument();
  });

  it('toggles between light and dark, persists the choice, and updates the token', () => {
    renderTheme();

    expect(screen.getByTestId('token')).toHaveTextContent(lightBgContainer);

    fireEvent.click(screen.getByRole('button', { name: '切换到深色模式' }));

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem(THEME_MODE_STORAGE_KEY)).toBe('dark');
    expect(screen.getByTestId('token')).toHaveTextContent(darkBgContainer);
    expect(screen.getByRole('button', { name: '切换到浅色模式' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '切换到浅色模式' }));

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(window.localStorage.getItem(THEME_MODE_STORAGE_KEY)).toBe('light');
    expect(screen.getByTestId('token')).toHaveTextContent(lightBgContainer);
  });

  it('follows a theme change made in another tab', () => {
    renderTheme();

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: THEME_MODE_STORAGE_KEY,
          newValue: 'dark',
        })
      );
    });

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByTestId('token')).toHaveTextContent(darkBgContainer);
  });

  it('does not expose a follow-system option', () => {
    renderTheme();

    expect(screen.queryByText(/跟随系统/)).not.toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});

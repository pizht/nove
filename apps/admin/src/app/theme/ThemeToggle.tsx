import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import Button from 'antd/es/button';
import Tooltip from 'antd/es/tooltip';
import { useThemeMode } from './useThemeMode';

export function ThemeToggle() {
  const { isDark, toggleMode } = useThemeMode();
  const label = isDark ? '切换到浅色模式' : '切换到深色模式';

  return (
    <Tooltip title={label}>
      <Button
        type="text"
        shape="circle"
        aria-label={label}
        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleMode}
      />
    </Tooltip>
  );
}

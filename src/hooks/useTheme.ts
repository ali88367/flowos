import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';

export function useTheme() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return { theme, setTheme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
}

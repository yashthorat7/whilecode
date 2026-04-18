'use client';

import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/app/utils/constants';

export function useTheme() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored) {
      setTheme(stored);
      document.documentElement.dataset.theme = stored;
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
      setTheme(systemTheme);
      document.documentElement.dataset.theme = systemTheme;
    }

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onSystemChange = e => {
      if (localStorage.getItem(STORAGE_KEYS.THEME)) return;
      const next = e.matches ? 'light' : 'dark';
      setTheme(next);
      document.documentElement.dataset.theme = next;
    };
    mq.addEventListener('change', onSystemChange);
    return () => mq.removeEventListener('change', onSystemChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem(STORAGE_KEYS.THEME, next);
  };

  return { theme, toggleTheme };
}

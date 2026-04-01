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
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
      document.documentElement.dataset.theme = 'light';
    } else {
      document.documentElement.dataset.theme = 'dark';
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem(STORAGE_KEYS.THEME, next);
  };

  return { theme, toggleTheme };
}

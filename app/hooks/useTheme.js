import { useState, useCallback } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = useCallback(() => {}, []);

  return { theme, toggleTheme };
};

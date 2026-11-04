// hooks/useDarkMode.js
import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('hcp_theme') === 'dark' ||
      (!localStorage.getItem('hcp_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hcp_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hcp_theme', 'light');
    }
  }, [dark]);

  return [dark, () => setDark((d) => !d)];
};

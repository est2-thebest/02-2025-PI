import React, { useState, useEffect, ReactNode } from 'react';
import { ThemeContext, ThemeType } from './ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Provedor de tema global.
 * Gerencia a preferência de cor (claro/escuro) e persistência.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Recuperar tema salvo no localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeType | null;
    if (savedTheme) return savedTheme;

    // Verificar preferência do sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Aplicar tema ao document e salvar no localStorage
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

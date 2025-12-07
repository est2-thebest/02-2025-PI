import { createContext } from 'react';

export type ThemeType = 'light' | 'dark';

/**
 * Definição do contexto de tema.
 * Personalização visual.
 */
export interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

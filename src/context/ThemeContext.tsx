import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  primary: string;
  primaryText: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  inputBackground: string;
  tabBar: string;
  header: string;
  statusPendente: string;
  statusEmAndamento: string;
  statusConcluida: string;
  priorityBaixa: string;
  priorityMedia: string;
  priorityAlta: string;
}

const lightColors: ThemeColors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#6C63FF',
  primaryText: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  inputBackground: '#F9FAFB',
  tabBar: '#FFFFFF',
  header: '#6C63FF',
  statusPendente: '#F59E0B',
  statusEmAndamento: '#3B82F6',
  statusConcluida: '#10B981',
  priorityBaixa: '#10B981',
  priorityMedia: '#F59E0B',
  priorityAlta: '#EF4444',
};

const darkColors: ThemeColors = {
  background: '#0F0F1A',
  surface: '#1A1A2E',
  card: '#16213E',
  primary: '#6C63FF',
  primaryText: '#FFFFFF',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  error: '#F87171',
  success: '#34D399',
  warning: '#FCD34D',
  inputBackground: '#1F2937',
  tabBar: '#1A1A2E',
  header: '#1A1A2E',
  statusPendente: '#FCD34D',
  statusEmAndamento: '#60A5FA',
  statusConcluida: '#34D399',
  priorityBaixa: '#34D399',
  priorityMedia: '#FCD34D',
  priorityAlta: '#F87171',
};

interface ThemeContextData {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const THEME_KEY = '@taskflow:theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((stored) => {
        if (stored === 'dark' || stored === 'light') setTheme(stored);
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    AsyncStorage.setItem(THEME_KEY, next);
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

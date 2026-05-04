import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthUser, Treatment } from '../types/user';

const USERS: User[] = [
  { id: 1, username: 'admin', password: '123', role: 'admin', name: 'Administrador' },
  { id: 2, username: 'user', password: '123', role: 'user', name: 'Usuário Comum' },
];

interface AuthContextData {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateTreatment: (treatment: Treatment) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AUTH_KEY = '@taskflow:auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_KEY);
        if (stored) setUser(JSON.parse(stored) as AuthUser);
      } catch {
        // AsyncStorage falhou — continua sem usuário logado
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const found = USERS.find(
      (u) => u.username === username && u.password === password,
    );
    if (!found) return false;
    const authUser: AuthUser = {
      id: found.id,
      username: found.username,
      role: found.role,
      name: found.name,
      treatment: 'Sr.',
    };
    setUser(authUser);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    return true;
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_KEY);
  };

  const updateTreatment = async (treatment: Treatment): Promise<void> => {
    if (!user) return;
    const updated: AuthUser = { ...user, treatment };
    setUser(updated);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateTreatment }}>
      {children}
    </AuthContext.Provider>
  );
}

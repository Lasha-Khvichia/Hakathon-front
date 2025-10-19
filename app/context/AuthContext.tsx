// context/AuthContext.tsx
"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { UserTypes } from '../BackAPI/UserTypes';

interface AuthContextType {
  user: UserTypes | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // TODO: Add auth logic
  const mockAuth: AuthContextType = {
    user: null,
    loading: false,
    error: null,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    isAuthenticated: false,
  };

  return (
    <AuthContext.Provider value={mockAuth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
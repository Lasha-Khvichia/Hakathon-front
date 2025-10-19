// context/AuthContext.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // Temporary dev bypass: treat user as authenticated so the app doesn't show auth modals.
    // Remove this bypass and implement real auth for production.
    user: {
      id: 1,
      name: 'Dev User',
      email: 'dev@example.com',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any,
    loading: false,
    error: null,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    isAuthenticated: true,
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
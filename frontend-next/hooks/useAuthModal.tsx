'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type AuthUser = { phone: string; name: string | null };

interface AuthModalContextType {
  isOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuth: boolean;
  phone: string | null;
  name: string | null;
  login: (user: { phone: string; name?: string | null }) => void;
  logout: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

const STORAGE_KEY = 'alanpir:auth';

function readUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object' && 'phone' in parsed && typeof (parsed as AuthUser).phone === 'string') {
      return { phone: (parsed as AuthUser).phone, name: (parsed as AuthUser).name ?? null };
    }
    return null;
  } catch {
    return null;
  }
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(readUser());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const value: AuthModalContextType = {
    isOpen,
    openAuthModal: () => setIsOpen(true),
    closeAuthModal: () => setIsOpen(false),
    isAuth: user !== null,
    phone: user?.phone ?? null,
    name: user?.name ?? null,
    login: ({ phone, name }) => setUser({ phone, name: name ?? null }),
    logout: () => setUser(null),
  };

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error('useAuthModal must be used within AuthModalProvider');
  return context;
}

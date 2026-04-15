'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  qty: number;
  imageUrl?: string;
  imageEmoji?: string;
}

interface CartContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  items: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items] = useState<CartItem[]>([
    { id: '1', name: 'Фыдджын (мясной)', weight: '1000 г', price: 1290, qty: 1, imageEmoji: '🥩' },
    { id: '2', name: 'Цахараджын', weight: '1000 г', price: 1120, qty: 1, imageEmoji: '🍃' },
    { id: '3', name: 'Морс клюквенный', weight: '1 л', price: 430, qty: 1, imageEmoji: '🥤' },
  ]);

  return (
    <CartContext.Provider value={{ isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false), items }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

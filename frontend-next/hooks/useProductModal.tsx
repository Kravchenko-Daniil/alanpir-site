'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  title: string;
  weight: string;
  price: number;
  imageEmoji?: string;
  imageUrl?: string;
  badge?: { text: string; type: 'hit' | 'new' };
  isVegan?: boolean;
}

interface ProductModalContextType {
  isOpen: boolean;
  product: Product | null;
  openModal: (product: Product) => void;
  closeModal: () => void;
}

const ProductModalContext = createContext<ProductModalContextType | undefined>(undefined);

export function ProductModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const openModal = (p: Product) => {
    setProduct(p);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setProduct(null), 300); // wait for animation
  };

  return (
    <ProductModalContext.Provider value={{ isOpen, product, openModal, closeModal }}>
      {children}
    </ProductModalContext.Provider>
  );
}

export function useProductModal() {
  const context = useContext(ProductModalContext);
  if (!context) throw new Error('useProductModal must be used within ProductModalProvider');
  return context;
}

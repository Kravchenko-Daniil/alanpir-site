'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '@/lib/menu';

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
    setTimeout(() => setProduct(null), 300);
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

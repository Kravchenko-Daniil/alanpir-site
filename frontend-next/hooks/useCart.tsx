'use client';

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import type { Product } from '@/lib/menu';
import { MENU } from '@/lib/menu';

export interface CartItem {
  id: string;          // `${productId}__${weight}` — уникальная строка корзины
  productId: string;
  name: string;
  weight: string;
  price: number;
  qty: number;
  imageUrl?: string;
  imageEmoji?: string;
  isBonus?: boolean;   // виртуальный бонусный товар (не хранится, не редактируется)
}

interface CartContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  items: CartItem[];
  /** items + бонус (если он начислен) — для отображения и отправки заказа */
  displayItems: CartItem[];
  /** виртуальный бонусный товар или null, если порог не достигнут */
  bonusItem: CartItem | null;
  totalQty: number;
  subtotal: number;
  addItem: (product: Product, weightIdx: number, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'alanpir:cart';

// Акция: бонусный пирог с капустой при заказе на сумму товаров строго больше порога.
const BONUS_THRESHOLD = 3000;
const BONUS_PRODUCT_ID = 'osetinskiy-pirog-s-kapustoi-kabuskadzhyn';
const BONUS_WEIGHT = '1000 г';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Загружаем сохранённую корзину один раз при mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  // Сохраняем при каждом изменении — но только после hydration,
  // иначе при первом рендере перезатрём данные пустым массивом.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full / disabled — игнорим
    }
  }, [items, hydrated]);

  const addItem = (product: Product, weightIdx: number, qty: number = 1) => {
    const w = product.weights[weightIdx];
    if (!w) return;
    const id = `${product.id}__${w.weight}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      }
      const next: CartItem = {
        id,
        productId: product.id,
        name: product.title,
        weight: w.weight,
        price: w.price,
        qty,
        imageUrl: product.image,
        imageEmoji: product.image ? undefined : product.emoji,
      };
      return [...prev, next];
    });
  };

  const updateQty = (id: string, qty: number) => {
    // Бонус — виртуальный, его qty не редактируется руками.
    if (id === BONUS_PRODUCT_ID) return;
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, qty } : i));
    });
  };

  const removeItem = (id: string) => {
    // Бонус нельзя удалить вручную — он начисляется автоматически.
    if (id === BONUS_PRODUCT_ID) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clear = () => setItems([]);

  const { totalQty, subtotal } = useMemo(() => {
    let q = 0;
    let s = 0;
    for (const i of items) {
      q += i.qty;
      s += i.price * i.qty;
    }
    return { totalQty: q, subtotal: s };
  }, [items]);

  // Виртуальный бонус: производное от subtotal, не хранится в items/localStorage.
  const bonusItem = useMemo<CartItem | null>(() => {
    if (subtotal <= BONUS_THRESHOLD) return null;
    const product = MENU.find((p) => p.id === BONUS_PRODUCT_ID);
    if (!product) return null;
    return {
      id: BONUS_PRODUCT_ID,
      productId: BONUS_PRODUCT_ID,
      name: product.title,
      weight: BONUS_WEIGHT,
      price: 0,
      qty: 1,
      imageUrl: product.image,
      imageEmoji: product.image ? undefined : product.emoji,
      isBonus: true,
    };
  }, [subtotal]);

  const displayItems = useMemo<CartItem[]>(
    () => (bonusItem ? [...items, bonusItem] : items),
    [items, bonusItem],
  );

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        items,
        displayItems,
        bonusItem,
        totalQty,
        subtotal,
        addItem,
        updateQty,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

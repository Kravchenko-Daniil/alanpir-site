'use client';

import { useEffect, useState } from 'react';
import type { SavedAddress } from '@/lib/address';

const KEY = 'alanpir:addresses';

type Stored = { addresses: SavedAddress[]; selectedId: string | null };

function read(): Stored {
  if (typeof window === 'undefined') return { addresses: [], selectedId: null };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { addresses: [], selectedId: null };
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray((parsed as Stored).addresses)
    ) {
      const p = parsed as Stored;
      return {
        addresses: p.addresses,
        selectedId: typeof p.selectedId === 'string' ? p.selectedId : null,
      };
    }
  } catch { /* corrupted */ }
  return { addresses: [], selectedId: null };
}

export function useSavedAddresses() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s = read();
    setAddresses(s.addresses);
    setSelectedId(s.selectedId);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return; // не перезаписываем хранилище до первого чтения
    if (typeof window === 'undefined') return;
    const payload: Stored = { addresses, selectedId };
    localStorage.setItem(KEY, JSON.stringify(payload));
  }, [addresses, selectedId, loaded]);

  const addAddress = (a: SavedAddress) => {
    setAddresses((prev) => [...prev, a]);
    setSelectedId(a.id);
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((x) => x.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  };

  return { addresses, selectedId, setSelectedId, addAddress, removeAddress };
}

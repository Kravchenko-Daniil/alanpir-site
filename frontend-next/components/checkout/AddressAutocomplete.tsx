'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export type AddressSuggestion = {
  value: string;
  street: string;
  house: string;
  house_type?: string;
  fias_id?: string | null;
  data: {
    street_with_type?: string;
    house_type?: string;
    house?: string;
    fias_id?: string | null;
    geo_lat?: string;
    geo_lon?: string;
    [key: string]: unknown;
  };
};

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
  onInvalidate?: () => void;
  placeholder?: string;
  className?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  onInvalidate,
  placeholder,
  className,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastQueryRef = useRef('');

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    const q = value.trim();
    lastQueryRef.current = q;
    if (!q) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const handle = window.setTimeout(async () => {
      if (lastQueryRef.current !== q) return;
      setLoading(true);
      try {
        const res = await api<{ ok: true; suggestions: AddressSuggestion[] }>(
          `/api/suggest/address?query=${encodeURIComponent(q)}`,
        );
        if (lastQueryRef.current !== q) return;
        setSuggestions(res.suggestions || []);
        setOpen(true);
        setHighlight(-1);
      } catch {
        if (lastQueryRef.current !== q) return;
        setSuggestions([]);
      } finally {
        if (lastQueryRef.current === q) setLoading(false);
      }
    }, 220);
    return () => window.clearTimeout(handle);
  }, [value]);

  const handleSelect = (s: AddressSuggestion) => {
    onChange(s.value);
    onSelect(s);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlight >= 0) {
        e.preventDefault();
        handleSelect(suggestions[highlight]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          onInvalidate?.();
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (suggestions.length) setOpen(true); }}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-40 left-0 right-0 mt-1 bg-surface border border-border-warm rounded-xl shadow-lg max-h-80 overflow-y-auto py-1"
        >
          {suggestions.map((s, i) => (
            <li key={`${s.fias_id ?? 'x'}-${i}-${s.value}`} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                onMouseEnter={() => setHighlight(i)}
                className={`w-full text-left px-4 py-2 text-sm text-ink transition-colors ${
                  i === highlight ? 'bg-terracotta/10' : 'hover:bg-terracotta/10'
                }`}
              >
                {s.value}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

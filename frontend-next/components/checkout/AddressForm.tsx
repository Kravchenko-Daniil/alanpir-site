'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import type { SavedAddress } from '@/lib/address';
import { formatFullAddress } from '@/lib/address';
import AddressAutocomplete, { type AddressSuggestion } from './AddressAutocomplete';

interface AddressFormProps {
  onCancel: () => void;
  onSave: (address: SavedAddress) => void;
}

export default function AddressForm({ onCancel, onSave }: AddressFormProps) {
  const [query, setQuery] = useState('');
  const [suggestion, setSuggestion] = useState<AddressSuggestion | null>(null);

  const [apt, setApt] = useState('');
  const [entrance, setEntrance] = useState('');
  const [floor, setFloor] = useState('');
  const [intercom, setIntercom] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (s: AddressSuggestion) => {
    setSuggestion(s);
    setError(null);
  };

  const invalidateSelection = () => {
    if (suggestion) setSuggestion(null);
  };

  const handleSave = () => {
    if (!suggestion) {
      setError('Выберите адрес из подсказок');
      return;
    }
    if (!suggestion.house) {
      setError('Укажите номер дома — без него доставка невозможна');
      return;
    }

    const base = suggestion.value;
    const fullValue = formatFullAddress(base, { apt, entrance, floor });
    const shortLabel = base;

    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `addr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    onSave({
      id,
      shortLabel,
      fullValue,
      street: suggestion.street,
      house: suggestion.house,
      apt: apt || undefined,
      entrance: entrance || undefined,
      floor: floor || undefined,
      intercom: intercom || undefined,
      fiasId: suggestion.fias_id ?? null,
      geo:
        suggestion.data?.geo_lat && suggestion.data?.geo_lon
          ? { lat: suggestion.data.geo_lat, lon: suggestion.data.geo_lon }
          : null,
    });
  };

  const inputClass =
    'w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-accent focus:outline-none transition-colors text-sm';

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="bg-bg-warm/50 rounded-xl p-4 md:p-6 border border-border-warm mt-4 space-y-4">
        <h4 className="font-semibold text-ink text-sm uppercase tracking-wide mb-2">Новый адрес</h4>

        <div>
          <label className="block text-xs text-muted mb-1">Адрес доставки</label>
          <AddressAutocomplete
            value={query}
            onChange={setQuery}
            onSelect={handleSelect}
            onInvalidate={invalidateSelection}
            placeholder="Начните вводить улицу и дом…"
            className={inputClass}
          />
          {error && <p className="text-xs text-danger mt-1.5">{error}</p>}
          {suggestion && !error && (
            <p className="text-xs text-muted mt-1.5">Выбрано: <span className="text-ink">{suggestion.value}</span></p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Квартира" value={apt} onChange={setApt} inputMode="numeric" />
          <Field label="Подъезд" value={entrance} onChange={setEntrance} inputMode="numeric" />
          <Field label="Этаж" value={floor} onChange={setFloor} inputMode="numeric" />
          <Field label="Домофон" value={intercom} onChange={setIntercom} />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-medium text-ink bg-surface border border-border-warm hover:bg-bg-warm transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-3 rounded-xl font-medium text-white bg-ink hover:bg-opacity-90 transition-opacity"
          >
            Сохранить
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: 'text' | 'numeric';
}) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
      <input
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors"
      />
    </div>
  );
}

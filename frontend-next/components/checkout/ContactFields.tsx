'use client';

import { useEffect, useState } from 'react';
import { IMaskInput } from 'react-imask';
import { isValidPhone, isValidEmail, isValidName } from '@/lib/validation';
import { useAuthModal } from '@/hooks/useAuthModal';

export type ContactValue = {
  name: string;
  phone: string;
  email: string;
};

export function isContactValid(v: ContactValue): boolean {
  if (!isValidName(v.name)) return false;
  if (!isValidPhone(v.phone)) return false;
  if (v.email && !isValidEmail(v.email)) return false;
  return true;
}

type Field = keyof ContactValue;

interface ContactFieldsProps {
  value: ContactValue;
  onChange: (value: ContactValue) => void;
}

export default function ContactFields({ value, onChange }: ContactFieldsProps) {
  const { phone: authPhone, name: authName } = useAuthModal();
  const [touched, setTouched] = useState<Record<Field, boolean>>({ name: false, phone: false, email: false });

  useEffect(() => {
    const patch: Partial<ContactValue> = {};
    if (authName && !value.name) patch.name = authName;
    if (authPhone && !value.phone) patch.phone = authPhone;
    if (Object.keys(patch).length) onChange({ ...value, ...patch });
  }, [authName, authPhone]); // eslint-disable-line react-hooks/exhaustive-deps

  const patch = (f: Field, v: string) => onChange({ ...value, [f]: v });

  const errors = {
    name: !isValidName(value.name) ? 'Укажите имя (минимум 2 символа)' : '',
    phone: !isValidPhone(value.phone) ? 'Введите корректный номер' : '',
    email: value.email && !isValidEmail(value.email) ? 'Неверный формат email' : '',
  };

  const fieldClass = (err: string, wasTouched: boolean) =>
    `w-full h-12 px-4 rounded-xl border bg-surface focus:outline-none transition-colors ${
      err && wasTouched ? 'border-danger focus:border-danger' : 'border-border-warm focus:border-accent'
    }`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Имя *</label>
        <input
          type="text"
          value={value.name}
          onChange={(e) => patch('name', e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          className={fieldClass(errors.name, touched.name)}
          placeholder="Иван"
        />
        {touched.name && errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Телефон *</label>
        <IMaskInput
          mask="+{7} (000) 000-00-00"
          value={value.phone}
          onAccept={(v: string) => patch('phone', v)}
          type="tel"
          inputMode="tel"
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          className={fieldClass(errors.phone, touched.phone)}
          placeholder="+7 (___) ___-__-__"
        />
        {touched.phone && errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Email (опционально)</label>
        <input
          type="email"
          value={value.email}
          onChange={(e) => patch('email', e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          className={fieldClass(errors.email, touched.email)}
          placeholder="Для отправки чека"
        />
        {touched.email && errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
      </div>
    </div>
  );
}

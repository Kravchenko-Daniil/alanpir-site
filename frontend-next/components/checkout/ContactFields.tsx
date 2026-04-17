'use client';

import { useState } from 'react';
import { formatPhone, isValidPhone, isValidEmail, isValidName } from '@/lib/validation';

interface ContactFieldsProps {
  isAuth: boolean;
}

type Field = 'name' | 'phone' | 'email';

export default function ContactFields({ isAuth }: ContactFieldsProps) {
  const [name, setName] = useState(isAuth ? 'Ибрагим' : '');
  const [phone, setPhone] = useState(isAuth ? '+7 (926) 499-00-99' : '');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState<Record<Field, boolean>>({ name: false, phone: false, email: false });

  const errors = {
    name: !isValidName(name) ? 'Укажите имя (минимум 2 символа)' : '',
    phone: !isValidPhone(phone) ? 'Введите корректный номер' : '',
    email: email && !isValidEmail(email) ? 'Неверный формат email' : '',
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          className={fieldClass(errors.name, touched.name)}
          placeholder="Иван"
        />
        {touched.name && errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">Телефон *</label>
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          className={fieldClass(errors.email, touched.email)}
          placeholder="Для отправки чека"
        />
        {touched.email && errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
      </div>
    </div>
  );
}

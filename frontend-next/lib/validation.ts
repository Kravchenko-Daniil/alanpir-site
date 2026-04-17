// Утилиты валидации для форм АланПир.
// Использование: см. ниже примеры.

export function formatPhone(raw: string): string {
  // Оставляю только цифры, нормализую к +7
  const digits = raw.replace(/\D/g, '');
  let d = digits;
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (!d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);

  const p1 = d.slice(1, 4); // 926
  const p2 = d.slice(4, 7); // 386
  const p3 = d.slice(7, 9); // 33
  const p4 = d.slice(9, 11); // 70

  let out = '+7';
  if (p1) out += ` (${p1}`;
  if (p1.length === 3) out += ')';
  if (p2) out += ` ${p2}`;
  if (p3) out += `-${p3}`;
  if (p4) out += `-${p4}`;
  return out;
}

export function phoneDigits(raw: string): string {
  return raw.replace(/\D/g, '');
}

export function isValidPhone(raw: string): boolean {
  const d = phoneDigits(raw);
  return d.length === 11 && (d.startsWith('7') || d.startsWith('8'));
}

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function isValidEmail(raw: string): boolean {
  return EMAIL_RE.test(raw.trim());
}

export function isValidName(raw: string): boolean {
  return raw.trim().length >= 2;
}

export function isValidPassword(raw: string): boolean {
  return raw.length >= 6;
}

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export type SavedAddress = {
  id: string;
  /** Короткая строка для карточки в списке: "ул. Трифоновская, д 4" */
  shortLabel: string;
  /** Полная строка для отправки в заказ: "г Москва, ул Трифоновская, д 4, кв 12, подъезд 1" */
  fullValue: string;
  /** Нормализованная улица для серверной валидации (DaData `street_with_type`) */
  street?: string;
  /** Номер дома для серверной валидации (DaData `house`) */
  house?: string;
  apt?: string;
  entrance?: string;
  floor?: string;
  intercom?: string;
  fiasId?: string | null;
  geo?: { lat: string; lon: string } | null;
};

export function formatFullAddress(
  base: string,
  extras: { apt?: string; entrance?: string; floor?: string },
): string {
  const parts: string[] = [base];
  if (extras.apt) parts.push(`кв ${extras.apt}`);
  if (extras.entrance) parts.push(`подъезд ${extras.entrance}`);
  if (extras.floor) parts.push(`эт ${extras.floor}`);
  return parts.join(', ');
}

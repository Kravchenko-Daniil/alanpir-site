const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

export class ApiError extends Error {
  code: string;
  httpStatus: number;
  constructor(code: string, httpStatus: number) {
    super(code);
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  const body = await res.json().catch(() => null);

  if (!body || typeof body !== 'object') {
    throw new ApiError(`HTTP_${res.status}`, res.status);
  }
  if ((body as { ok?: unknown }).ok === false) {
    const code = (body as { error?: string }).error ?? 'UNKNOWN';
    throw new ApiError(code, res.status);
  }
  return body as T;
}

/** Перевод code → понятное сообщение для UI. Неизвестные коды отдаём как есть. */
export function describeApiError(code: string): string {
  const map: Record<string, string> = {
    INVALID_PHONE: 'Введите корректный номер телефона',
    WEAK_PASSWORD: 'Пароль должен быть минимум 6 символов',
    USER_EXISTS: 'Пользователь с таким номером уже зарегистрирован',
    NO_USER: 'Пользователь не найден — сначала зарегистрируйтесь',
    BAD_CREDENTIALS: 'Неверный номер или пароль',
    EMPTY_CART: 'Корзина пустая',
    ADDRESS_INVALID: 'Адрес не прошёл проверку. Проверьте улицу и дом',
    NEED_STREET_HOUSE: 'Нужны и улица, и номер дома',
    NO_MATCH: 'Такой адрес не найден в справочнике',
    INCOMPLETE: 'Адрес не полный: укажите дом',
    BAD_STREET: 'Проверьте название улицы',
    BAD_HOUSE: 'Проверьте номер дома',
    DB_ERROR: 'Временная ошибка базы данных — попробуйте ещё раз',
  };
  return map[code] || 'Что-то пошло не так. Попробуйте ещё раз';
}

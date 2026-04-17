'use client';

import { useEffect, useState } from 'react';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useSavedAddresses } from '@/hooks/useSavedAddresses';
import { User, MapPin, Package, LogOut, Loader2, X } from 'lucide-react';
import AddressForm from '@/components/checkout/AddressForm';
import type { SavedAddress } from '@/lib/address';
import { api, ApiError } from '@/lib/api';

type OrderRow = {
  id: number;
  phone: string | null;
  name: string | null;
  address: string | null;
  payment_method: string | null;
  items_json: string;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  status: string;
  created_at: string;
};

type OrdersState =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'ready'; orders: OrderRow[] }
  | { phase: 'error'; message: string };

function orderStatusLabel(status: string): { text: string; className: string } {
  switch (status) {
    case 'new':      return { text: 'В обработке', className: 'bg-accent/10 text-accent' };
    case 'accepted': return { text: 'Готовится', className: 'bg-accent/10 text-accent' };
    case 'delivering': return { text: 'В пути', className: 'bg-accent/10 text-accent' };
    case 'done':     return { text: 'Доставлен', className: 'bg-[#34C759]/10 text-[#34C759]' };
    case 'cancelled': return { text: 'Отменён', className: 'bg-bg-warm text-muted' };
    default: return { text: status || '—', className: 'bg-bg-warm text-muted' };
  }
}

export default function AccountPage() {
  const { isAuth, phone, name, logout, openAuthModal } = useAuthModal();
  const { addresses, addAddress, removeAddress } = useSavedAddresses();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [ordersState, setOrdersState] = useState<OrdersState>({ phase: 'idle' });

  useEffect(() => {
    if (!phone) {
      setOrdersState({ phase: 'idle' });
      return;
    }
    let cancelled = false;
    setOrdersState({ phase: 'loading' });
    api<{ ok: true; orders: OrderRow[] }>(`/api/orders?phone=${encodeURIComponent(phone)}`)
      .then((res) => { if (!cancelled) setOrdersState({ phase: 'ready', orders: res.orders }); })
      .catch((err) => {
        if (cancelled) return;
        const msg = err instanceof ApiError ? err.code : 'Не удалось загрузить заказы';
        setOrdersState({ phase: 'error', message: msg });
      });
    return () => { cancelled = true; };
  }, [phone]);

  const handleAddAddress = (a: SavedAddress) => {
    addAddress(a);
    setIsAddingAddress(false);
  };

  if (!isAuth) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-bg-warm rounded-full flex items-center justify-center text-terracotta mb-6">
          <User className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif text-ink mb-4">Войдите в личный кабинет</h1>
        <p className="text-muted mb-8 max-w-md">
          Смотрите историю заказов, сохранённые адреса и копите бонусы.
        </p>
        <button
          onClick={openAuthModal}
          className="bg-terracotta text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-opacity"
        >
          Войти или зарегистрироваться
        </button>
      </div>
    );
  }

  const displayName = name?.trim() || 'Гость';
  const initials = displayName
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'А';

  return (
    <div className="py-10">
      <h1 className="text-4xl md:text-5xl mb-8 text-ink font-serif">Личный кабинет</h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
        {/* Sidebar */}
        <div className="bg-surface rounded-2xl border border-border-warm p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-terracotta text-white flex items-center justify-center text-2xl font-serif mb-4">
            {initials}
          </div>
          <h2 className="text-xl font-bold text-ink mb-1">{displayName}</h2>
          <p className="text-sm text-muted mb-8">{phone}</p>

          <button
            onClick={logout}
            className="w-full py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {/* Orders */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-ink" />
              <h3 className="text-xl font-serif text-ink">Мои заказы</h3>
            </div>

            {ordersState.phase === 'loading' && (
              <div className="bg-surface rounded-2xl border border-border-warm p-6 flex items-center gap-3 text-muted text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Загружаем историю заказов…
              </div>
            )}

            {ordersState.phase === 'error' && (
              <div className="bg-surface rounded-2xl border border-border-warm p-6 text-sm text-muted">
                Не удалось загрузить заказы. Обновите страницу позже.
              </div>
            )}

            {ordersState.phase === 'ready' && ordersState.orders.length === 0 && (
              <div className="bg-surface rounded-2xl border border-border-warm p-6 text-sm text-muted">
                Пока заказов нет. После первой покупки история появится здесь.
              </div>
            )}

            {ordersState.phase === 'ready' && ordersState.orders.length > 0 && (
              <div className="flex flex-col gap-4">
                {ordersState.orders.map((o) => {
                  const status = orderStatusLabel(o.status);
                  const items = (() => {
                    try {
                      const parsed = JSON.parse(o.items_json) as Array<{ name?: string; title?: string }>;
                      return parsed.map((i) => i.name || i.title || '').filter(Boolean).join(', ');
                    } catch {
                      return '';
                    }
                  })();
                  const date = (() => {
                    try { return new Date(o.created_at).toLocaleDateString('ru-RU'); } catch { return o.created_at; }
                  })();
                  return (
                    <div key={o.id} className="bg-surface rounded-2xl border border-border-warm p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="font-semibold text-ink">Заказ №{o.id}</span>
                          <span className="text-sm text-muted ml-2">от {date}</span>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${status.className}`}>
                          {status.text}
                        </div>
                      </div>
                      {items && <p className="text-sm text-muted mb-4 line-clamp-2">{items}</p>}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ink">{o.total.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Addresses */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-ink" />
              <h3 className="text-xl font-serif text-ink">Мои адреса</h3>
            </div>

            <div className="flex flex-col gap-3">
              {addresses.length === 0 && !isAddingAddress && (
                <p className="text-sm text-muted">Сохранённых адресов пока нет.</p>
              )}

              {addresses.map((a) => {
                const details = [
                  a.apt && `кв ${a.apt}`,
                  a.entrance && `подъезд ${a.entrance}`,
                  a.floor && `эт ${a.floor}`,
                  a.intercom && `домофон ${a.intercom}`,
                ].filter(Boolean).join(', ');
                return (
                  <div key={a.id} className="bg-surface rounded-2xl border border-border-warm p-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium text-ink mb-1 truncate">{a.shortLabel}</div>
                      {details && <div className="text-sm text-muted truncate">{details}</div>}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAddress(a.id)}
                      aria-label="Удалить адрес"
                      className="text-muted hover:text-danger transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {!isAddingAddress ? (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="w-full py-4 border-2 border-dashed border-border-warm rounded-2xl text-sm font-medium text-ink hover:border-terracotta hover:text-terracotta transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  {addresses.length > 0 ? '+ Добавить ещё адрес' : '+ Добавить адрес'}
                </button>
              ) : (
                <AddressForm
                  onCancel={() => setIsAddingAddress(false)}
                  onSave={handleAddAddress}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

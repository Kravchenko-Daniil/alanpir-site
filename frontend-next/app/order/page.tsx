'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, ChefHat, Bike, Check, Loader2, AlertTriangle } from 'lucide-react';
import { api, ApiError } from '@/lib/api';

type OrderItem = {
  id?: string;
  name?: string;
  title?: string;
  weight?: string;
  price: number;
  qty: number;
};

type Order = {
  id: number;
  phone: string | null;
  name: string | null;
  address: string | null;
  payment_method: string | null;
  items_json: string;
  promo: string | null;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  status: string;
  created_at: string;
};

type OrderState =
  | { phase: 'loading' }
  | { phase: 'ready'; order: Order; items: OrderItem[] }
  | { phase: 'error'; message: string };

const PAYMENT_LABEL: Record<string, string> = {
  card: 'Банковская карта',
  sbp: 'СБП',
  cash: 'При получении',
};

function formatPaymentMethod(m: string | null | undefined): string {
  if (!m) return '—';
  return PAYMENT_LABEL[m] || m;
}

function isPickupAddress(addr: string | null): boolean {
  if (!addr) return false;
  return /самовывоз/i.test(addr);
}

const STATUS_ORDER = ['new', 'accepted', 'delivering', 'done'];

function progressStepActive(currentStatus: string, index: number): 'done' | 'current' | 'pending' {
  const curIdx = STATUS_ORDER.indexOf(currentStatus);
  if (curIdx === -1) return index === 0 ? 'current' : 'pending';
  if (index < curIdx) return 'done';
  if (index === curIdx) return 'current';
  return 'pending';
}

function OrderContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [state, setState] = useState<OrderState>({ phase: 'loading' });

  useEffect(() => {
    if (!id) {
      setState({ phase: 'error', message: 'Не передан номер заказа' });
      return;
    }
    let cancelled = false;
    setState({ phase: 'loading' });
    api<{ ok: true; order: Order }>(`/api/orders/${encodeURIComponent(id)}`)
      .then((res) => {
        if (cancelled) return;
        let items: OrderItem[] = [];
        try {
          const parsed = JSON.parse(res.order.items_json) as OrderItem[];
          if (Array.isArray(parsed)) items = parsed;
        } catch { /* ignore malformed items */ }
        setState({ phase: 'ready', order: res.order, items });
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err instanceof ApiError && err.code === 'NOT_FOUND'
          ? 'Заказ не найден'
          : 'Не удалось загрузить заказ';
        setState({ phase: 'error', message: msg });
      });
    return () => { cancelled = true; };
  }, [id]);

  if (state.phase === 'loading') {
    return (
      <div className="py-20 flex flex-col items-center text-muted gap-3">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Загружаем заказ…</span>
      </div>
    );
  }

  if (state.phase === 'error') {
    return (
      <div className="py-16 max-w-lg mx-auto flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-serif text-ink">{state.message}</h1>
        <p className="text-muted text-sm">Проверьте ссылку или вернитесь в каталог.</p>
        <Link href="/catalog/" className="mt-4 px-6 py-3 rounded-xl bg-terracotta text-white font-medium hover:bg-opacity-90 transition-opacity">
          В каталог
        </Link>
      </div>
    );
  }

  const { order, items } = state;
  const pickup = isPickupAddress(order.address);
  const dateStr = (() => {
    try { return new Date(order.created_at).toLocaleString('ru-RU'); } catch { return order.created_at; }
  })();

  return (
    <div className="py-12 md:py-20 max-w-2xl mx-auto flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-[#34C759]/10 rounded-full flex items-center justify-center text-[#34C759] mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h1 className="text-4xl md:text-5xl font-serif text-ink mb-4">
        Заказ №{order.id} принят
      </h1>
      <p className="text-lg text-muted mb-2">
        Мы уже начали готовить. Ждите звонка курьера.
      </p>
      <p className="text-xs text-muted mb-10">{dateStr}</p>

      <div className="w-full bg-surface rounded-2xl border border-border-warm p-6 mb-6 text-left">
        <h3 className="font-serif text-xl text-ink mb-4">Детали заказа</h3>

        <div className="flex flex-col gap-3 mb-6">
          {items.map((it, idx) => (
            <div key={it.id ?? idx} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-2xl shrink-0">🥮</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink truncate">{it.name || it.title}</div>
                {it.weight && <div className="text-xs text-muted">{it.weight}</div>}
              </div>
              <div className="text-sm font-bold text-ink whitespace-nowrap">{it.qty} × {it.price.toLocaleString('ru-RU')} ₽</div>
            </div>
          ))}
        </div>

        <hr className="border-border-warm mb-4" />

        <div className="flex flex-col gap-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-muted">Способ получения:</span>
            <span className="font-medium text-ink">{pickup ? 'Самовывоз' : 'Доставка'}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted shrink-0">Адрес:</span>
            <span className="font-medium text-ink text-right">{order.address || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Оплата:</span>
            <span className="font-medium text-ink">{formatPaymentMethod(order.payment_method)}</span>
          </div>
          {order.name && (
            <div className="flex justify-between">
              <span className="text-muted">Имя:</span>
              <span className="font-medium text-ink">{order.name}</span>
            </div>
          )}
          {order.phone && (
            <div className="flex justify-between">
              <span className="text-muted">Телефон:</span>
              <span className="font-medium text-ink">{order.phone}</span>
            </div>
          )}
        </div>

        <hr className="border-border-warm mb-4" />

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Товары:</span>
            <span>{order.subtotal.toLocaleString('ru-RU')} ₽</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-terracotta">
              <span>Скидка:</span>
              <span>−{order.discount.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
          {!pickup && (
            <div className="flex justify-between">
              <span className="text-muted">Доставка:</span>
              <span>{order.delivery === 0 ? 'Бесплатно' : `${order.delivery} ₽`}</span>
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <span className="text-base font-semibold text-ink">Итого:</span>
            <span className="text-xl font-bold text-ink">{order.total.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-surface rounded-2xl border border-border-warm p-6 mb-8 text-left">
        <h3 className="font-serif text-xl text-ink mb-6">Что дальше?</h3>

        <div className="flex justify-between relative">
          {[
            { icon: Package, label: 'Принят' },
            { icon: ChefHat, label: 'Готовится' },
            { icon: Bike, label: 'В пути' },
            { icon: Check, label: 'Доставлен' },
          ].map((step, i) => {
            const state = progressStepActive(order.status, i);
            const ActiveIcon = step.icon;
            const circleClass =
              state === 'pending'
                ? 'bg-surface border-2 border-border-warm text-muted'
                : 'bg-terracotta text-white';
            const labelClass = state === 'pending' ? 'text-muted' : 'text-ink';
            return (
              <div key={step.label} className="flex flex-col items-center gap-2 z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${circleClass}`}>
                  <ActiveIcon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${labelClass}`}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full mb-12">
        <Link
          href="/catalog/"
          className="flex-1 py-4 rounded-xl font-semibold text-ink border border-border-warm hover:bg-bg-warm transition-colors text-center"
        >
          В каталог
        </Link>
        <Link
          href="/account/"
          className="flex-1 py-4 rounded-xl font-semibold text-white bg-terracotta hover:bg-opacity-90 transition-opacity text-center"
        >
          В личный кабинет
        </Link>
      </div>

      <div className="text-sm text-muted">
        Что-то не так? Звоните <a href="tel:+79264990099" className="text-ink font-medium hover:underline">+7 (926) 499-00-99</a> или пишите в <a href="https://wa.me/79264990099" className="text-ink font-medium hover:underline">WhatsApp</a>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Загрузка...</div>}>
      <OrderContent />
    </Suspense>
  );
}

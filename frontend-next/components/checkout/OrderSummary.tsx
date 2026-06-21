'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  qty: number;
  imageUrl?: string;
  imageEmoji?: string;
  isBonus?: boolean;
}

interface OrderSummaryProps {
  items: CartItem[];
  deliveryMethod: 'delivery' | 'pickup';

  /** Подсчитанные суммы (вычислены в родителе) */
  subtotal: number;
  discount: number;
  deliveryCost: number;
  /** true для зоны «за МКАД» — стоимость доставки уточняется у оператора */
  deliveryUnknown: boolean;
  total: number;
  isBelowMinOrder: boolean;
  missingForMinOrder: number;

  /** Submit */
  submitting: boolean;
  onSubmit: () => void;
}

export default function OrderSummary({
  items,
  deliveryMethod,
  subtotal,
  discount,
  deliveryCost,
  deliveryUnknown,
  total,
  isBelowMinOrder,
  missingForMinOrder,
  submitting,
  onSubmit,
}: OrderSummaryProps) {
  const isDelivery = deliveryMethod === 'delivery';

  return (
    <div className="sticky top-24 bg-surface rounded-2xl border border-border-warm p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif text-ink">Ваш заказ</h2>
        <span className="text-sm text-muted">{items.length} позиции</span>
      </div>

      {/* Items List */}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-2xl shrink-0 overflow-hidden relative">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              ) : (
                item.imageEmoji
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink truncate">{item.name}</div>
              <div className="text-xs text-muted">
                {item.weight} • {item.qty} шт
                {item.isBonus && <span className="text-terracotta font-semibold"> • Бонус</span>}
              </div>
            </div>
            <div className="text-sm font-bold text-ink whitespace-nowrap">
              {item.isBonus ? 'Бесплатно' : `${(item.price * item.qty).toLocaleString('ru-RU')} ₽`}
            </div>
          </div>
        ))}

        <Link href="/catalog" className="flex items-center gap-2 text-sm font-medium text-terracotta hover:underline mt-2">
          <Plus className="w-4 h-4" />
          Добавить ещё
        </Link>
      </div>

      <hr className="border-border-warm" />

      {/* Totals */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-muted">
          <span>Товары:</span>
          <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-terracotta">
            <span>Скидка за самовывоз −10%:</span>
            <span>−{Math.round(discount).toLocaleString('ru-RU')} ₽</span>
          </div>
        )}
        {isDelivery && (
          <div className="flex justify-between text-muted">
            <span>Доставка:</span>
            <span>{deliveryUnknown ? 'уточняется у оператора' : deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}</span>
          </div>
        )}

        <hr className="border-border-warm my-2" />

        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-ink">Итого:</span>
          <span className="text-2xl font-bold text-ink">{Math.round(total).toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>

      {/* Minimum Order Warning */}
      {isBelowMinOrder && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-red-600 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>До минимального заказа на доставку не хватает <b>{missingForMinOrder.toLocaleString('ru-RU')} ₽</b></p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled={isBelowMinOrder || submitting}
          onClick={onSubmit}
          className="w-full bg-terracotta text-white py-4 rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? 'Отправляем…' : `Оформить заказ • ${Math.round(total).toLocaleString('ru-RU')} ₽`}
        </button>
        <p className="text-[11px] text-muted text-center leading-tight">
          Нажимая кнопку, вы соглашаетесь с <Link href="/offer/" className="underline hover:text-ink">офертой</Link> и <Link href="/privacy/" className="underline hover:text-ink">политикой конфиденциальности</Link>
        </p>
      </div>
    </div>
  );
}

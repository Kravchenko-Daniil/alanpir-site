'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, X, AlertCircle } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  qty: number;
  imageUrl?: string;
  imageEmoji?: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  deliveryMethod: 'delivery' | 'pickup';
}

export default function OrderSummary({ items, deliveryMethod }: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState('');
  const [promoActive, setPromoActive] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  // Logic
  const isDelivery = deliveryMethod === 'delivery';
  const minOrderForDelivery = 2000;
  const freeDeliveryThreshold = 5000;
  
  const isBelowMinOrder = isDelivery && subtotal < minOrderForDelivery;
  const missingForMinOrder = minOrderForDelivery - subtotal;
  
  let discount = 0;
  if (promoActive) discount += subtotal * 0.1; // 10% promo
  if (!isDelivery) discount += subtotal * 0.1; // 10% pickup discount
  
  let deliveryCost = 0;
  if (isDelivery) {
    deliveryCost = subtotal >= freeDeliveryThreshold ? 0 : 140; // Mock 140 rub delivery
  }

  const total = subtotal - discount + deliveryCost;

  const handleApplyPromo = () => {
    if (promoCode.trim()) setPromoActive(true);
  };

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
              <div className="text-xs text-muted">{item.weight} • {item.qty} шт</div>
            </div>
            <div className="text-sm font-bold text-ink whitespace-nowrap">
              {(item.price * item.qty).toLocaleString('ru-RU')} ₽
            </div>
          </div>
        ))}
        
        <Link href="/catalog" className="flex items-center gap-2 text-sm font-medium text-terracotta hover:underline mt-2">
          <Plus className="w-4 h-4" />
          Добавить ещё
        </Link>
      </div>

      <hr className="border-border-warm" />

      {/* Promo Code */}
      <div>
        {!promoActive ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Промокод"
              className="flex-1 h-12 px-4 rounded-xl border border-border-warm bg-surface focus:border-terracotta focus:outline-none transition-colors text-sm"
            />
            <button
              onClick={handleApplyPromo}
              className="h-12 px-6 rounded-xl bg-ink text-white text-sm font-medium hover:bg-opacity-90 transition-opacity"
            >
              Применить
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-[#34C759]/10 text-[#34C759] px-3 py-2 rounded-lg text-sm font-medium border border-[#34C759]/20">
            Промокод −10% активен
            <button onClick={() => { setPromoActive(false); setPromoCode(''); }} className="hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-muted">
          <span>Товары:</span>
          <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-terracotta">
            <span>Скидка:</span>
            <span>−{discount.toLocaleString('ru-RU')} ₽</span>
          </div>
        )}
        {isDelivery && (
          <div className="flex justify-between text-muted">
            <span>Доставка:</span>
            <span>{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}</span>
          </div>
        )}
        
        <hr className="border-border-warm my-2" />
        
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-ink">Итого:</span>
          <span className="text-2xl font-bold text-ink">{total.toLocaleString('ru-RU')} ₽</span>
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
          disabled={isBelowMinOrder}
          className="w-full bg-terracotta text-white py-4 rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Оформить заказ • {total.toLocaleString('ru-RU')} ₽
        </button>
        <p className="text-[11px] text-muted text-center leading-tight">
          Нажимая кнопку, вы соглашаетесь с <Link href="#" className="underline hover:text-ink">офертой</Link> и <Link href="#" className="underline hover:text-ink">политикой конфиденциальности</Link>
        </p>
      </div>
    </div>
  );
}

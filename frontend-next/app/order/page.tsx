'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, ChefHat, Bike, Check } from 'lucide-react';

function OrderContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '1024';

  return (
    <div className="py-12 md:py-20 max-w-2xl mx-auto flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-[#34C759]/10 rounded-full flex items-center justify-center text-[#34C759] mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h1 className="text-4xl md:text-5xl font-serif text-ink mb-4">
        Заказ №{id} принят
      </h1>
      <p className="text-lg text-muted mb-10">
        Мы уже начали готовить. Ждите звонка курьера.
      </p>

      <div className="w-full bg-surface rounded-2xl border border-border-warm p-6 mb-6 text-left">
        <h3 className="font-serif text-xl text-ink mb-4">Детали заказа</h3>

        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-2xl shrink-0">🥩</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink">Фыдджын (мясной)</div>
              <div className="text-xs text-muted">1000 г</div>
            </div>
            <div className="text-sm font-bold text-ink">1 × 1 290 ₽</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-2xl shrink-0">🍃</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink">Цахараджын</div>
              <div className="text-xs text-muted">1000 г</div>
            </div>
            <div className="text-sm font-bold text-ink">1 × 1 120 ₽</div>
          </div>
        </div>

        <hr className="border-border-warm mb-4" />

        <div className="flex flex-col gap-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-muted">Способ получения:</span>
            <span className="font-medium text-ink">Доставка</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Адрес:</span>
            <span className="font-medium text-ink">Москва, ул. Ленина, 10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Время:</span>
            <span className="font-medium text-ink">Как можно скорее</span>
          </div>
        </div>

        <hr className="border-border-warm mb-4" />

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Товары:</span>
            <span>2 410 ₽</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Доставка:</span>
            <span>140 ₽</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-base font-semibold text-ink">Итого:</span>
            <span className="text-xl font-bold text-ink">2 550 ₽</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-surface rounded-2xl border border-border-warm p-6 mb-8 text-left">
        <h3 className="font-serif text-xl text-ink mb-6">Что дальше?</h3>

        <div className="flex justify-between relative">
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-border-warm -z-10"></div>
          <div className="absolute top-5 left-6 w-1/3 h-0.5 bg-terracotta -z-10"></div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-terracotta text-white flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-ink">Принят</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-terracotta text-white flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-ink">Готовится</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-surface border-2 border-border-warm text-muted flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-muted">В пути</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-surface border-2 border-border-warm text-muted flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-muted">Доставлен</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full mb-12">
        <Link
          href="/catalog"
          className="flex-1 py-4 rounded-xl font-semibold text-ink border border-border-warm hover:bg-bg-warm transition-colors"
        >
          В каталог
        </Link>
        <Link
          href="/account"
          className="flex-1 py-4 rounded-xl font-semibold text-white bg-terracotta hover:bg-opacity-90 transition-opacity"
        >
          В личный кабинет
        </Link>
      </div>

      <div className="text-sm text-muted">
        Случилось что-то не так? Звоните <a href="tel:+79264990099" className="text-ink font-medium hover:underline">+7 (926) 499-00-99</a> или пишите в <a href="https://wa.me/79264990099" className="text-ink font-medium hover:underline">WhatsApp</a>
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

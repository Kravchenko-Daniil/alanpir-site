import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { Check, Star, Flame, Gift, Truck, UtensilsCrossed, Sparkles } from 'lucide-react';
import { MENU } from '@/lib/menu';

const HITS = MENU.filter((p) => p.badge === 'hit' || p.badge === 'new').slice(0, 3);
const FEATURED = HITS.length >= 3 ? HITS : MENU.slice(0, 3);

export default function Home() {
  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="py-10 md:py-16 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-[52px] leading-[1.1] mb-6 text-ink font-serif">
            Горячие осетинские пироги по Москве <span className="text-terracotta italic">от 20 минут</span>
          </h1>
          <p className="text-lg text-muted mb-6 max-w-[400px]">
            Традиционные рецепты, натуральные ингредиенты и ручная лепка. Доставляем тепло в каждый дом.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="inline-block px-3 py-1 bg-bg-warm border border-border-warm rounded-full text-xs font-medium text-ink">Традиционные рецепты</span>
            <span className="inline-block px-3 py-1 bg-bg-warm border border-border-warm rounded-full text-xs font-medium text-ink">Натуральные ингредиенты</span>
            <span className="inline-block px-3 py-1 bg-bg-warm border border-border-warm rounded-full text-xs font-medium text-ink">Рейтинг 5.0★</span>
          </div>
          <Link 
            href="/catalog" 
            className="inline-block bg-terracotta text-white px-9 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-opacity"
          >
            Смотреть меню
          </Link>
        </div>
        <div className="w-full h-[320px] md:h-[400px] bg-[#EFECE7] rounded-3xl relative overflow-hidden flex items-center justify-center">
          <Image 
            src="https://picsum.photos/seed/pie/500/400" 
            alt="Осетинский пирог" 
            fill 
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-5 left-5 bg-surface px-4 py-2 rounded-full text-xs font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-ink z-10">
            Фыдджын — легенда гор
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
        <div className="bg-surface p-5 rounded-2xl border border-border-warm flex items-center gap-4">
          <div className="w-10 h-10 bg-bg-warm rounded-full flex items-center justify-center text-terracotta shrink-0">
            <Check className="w-5 h-5" strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink mb-0.5 font-sans">Фермерское мясо</h3>
            <p className="text-xs text-muted">Только свежие ингредиенты</p>
          </div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-border-warm flex items-center gap-4">
          <div className="w-10 h-10 bg-bg-warm rounded-full flex items-center justify-center text-terracotta shrink-0">
            <Star className="w-5 h-5" strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink mb-0.5 font-sans">Рейтинг 5.0</h3>
            <p className="text-xs text-muted">На Яндекс Картах</p>
          </div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-border-warm flex items-center gap-4">
          <div className="w-10 h-10 bg-bg-warm rounded-full flex items-center justify-center text-terracotta shrink-0">
            <Flame className="w-5 h-5" strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink mb-0.5 font-sans">Печем под заказ</h3>
            <p className="text-xs text-muted">Приезжает горячим</p>
          </div>
        </div>
      </section>

      {/* Hits Section */}
      <section className="mb-16">
        <h2 className="text-3xl mb-6 text-ink font-serif">Популярно сейчас</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {FEATURED.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promotions Section */}
      <section>
        <h2 className="text-3xl mb-6 text-ink font-serif">Текущие акции</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface p-5 rounded-2xl border border-border-warm flex flex-col gap-3">
            <div className="text-terracotta">
              <Gift className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink mb-1">Самовывоз −10%</h3>
              <p className="text-xs text-muted">Скидка на весь заказ при самовывозе</p>
            </div>
          </div>
          <div className="bg-surface p-5 rounded-2xl border border-border-warm flex flex-col gap-3">
            <div className="text-terracotta">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink mb-1">Бесплатная доставка</h3>
              <p className="text-xs text-muted">При заказе на сумму от 5000 ₽</p>
            </div>
          </div>
          <div className="bg-surface p-5 rounded-2xl border border-border-warm flex flex-col gap-3">
            <div className="text-terracotta">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink mb-1">Нож в подарок</h3>
              <p className="text-xs text-muted">Фирменный нож при заказе от 7000 ₽</p>
            </div>
          </div>
          <div className="bg-surface p-5 rounded-2xl border border-border-warm flex flex-col gap-3">
            <div className="text-terracotta">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink mb-1">Пирог в подарок</h3>
              <p className="text-xs text-muted">Сладкий пирог при заказе от 3000 ₽</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

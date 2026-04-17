import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { ChefHat, Leaf, Flame, Star, Gift, Truck, PieChart, UtensilsCrossed } from 'lucide-react';
import { MENU } from '@/lib/menu';
import { menuJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Осетинские пироги с доставкой по Москве',
  description:
    'Доставка горячих осетинских пирогов по Москве за 40–120 минут. Фыдджын, Цахараджын, Уалибах, сладкие пироги и сеты. Традиционные рецепты, ручная лепка.',
  alternates: { canonical: '/' },
};

export default function Home() {
  const hits = MENU.filter((p) => p.badge === 'hit').slice(0, 4);
  const ossetian = MENU.filter((p) => p.categorySlug === 'ossetian').slice(0, 4);
  const meat = MENU.filter((p) => p.categorySlug === 'meat').slice(0, 4);
  const sweet = MENU.filter((p) => p.categorySlug === 'sweet').slice(0, 4);

  return (
    <div className="pb-16 pt-4 sm:pt-6 flex flex-col gap-10 md:gap-16">
      <Script
        id="ld-menu"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd(MENU)) }}
      />
      
      {/* 1. Banner Slot */}
      <section>
        <div className="w-full min-h-[140px] sm:aspect-[16/6] md:aspect-[16/5] bg-accent/10 border-2 border-dashed border-accent/40 rounded-3xl flex flex-col items-center justify-center text-center p-6 text-accent">
          <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-balance">Место под фото-баннер</span>
          <span className="text-xs sm:text-sm font-medium opacity-80 text-balance">Здесь будет красивое фото пирогов</span>
        </div>
      </section>

      {/* 2. Hero & Advantages */}
      <section className="flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.15] mb-4 md:mb-6 text-ink font-serif font-bold text-balance">
          Осетинские пироги <span className="text-accent underline decoration-accent/30 underline-offset-4">АланПир</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted mb-8 md:mb-10 max-w-2xl text-balance px-2">
          Традиционные рецепты, ручная лепка, доставка горячими по Москве за 40–120 минут.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full">
          <div className="bg-surface p-3 md:p-4 rounded-xl sm:rounded-2xl border border-border-warm flex flex-col items-center text-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-bg-warm rounded-full flex items-center justify-center text-accent shrink-0">
              <ChefHat className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
            </div>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-ink leading-tight text-balance">Печём под заказ</span>
          </div>
          <div className="bg-surface p-3 md:p-4 rounded-xl sm:rounded-2xl border border-border-warm flex flex-col items-center text-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-bg-warm rounded-full flex items-center justify-center text-accent shrink-0">
              <Leaf className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
            </div>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-ink leading-tight text-balance">Натуральные ингредиенты</span>
          </div>
          <div className="bg-surface p-3 md:p-4 rounded-xl sm:rounded-2xl border border-border-warm flex flex-col items-center text-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-bg-warm rounded-full flex items-center justify-center text-accent shrink-0">
              <Flame className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
            </div>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-ink leading-tight text-balance">Доставка горячими</span>
          </div>
          <div className="bg-surface p-3 md:p-4 rounded-xl sm:rounded-2xl border border-border-warm flex flex-col items-center text-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-bg-warm rounded-full flex items-center justify-center text-accent shrink-0">
              <Star className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
            </div>
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-ink leading-tight text-balance">Рейтинг 5★</span>
          </div>
        </div>
      </section>

      {/* 3. Category: Hits */}
      {hits.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-ink font-serif font-bold">Хиты</h2>
            <Link href="/catalog" className="text-accent font-bold text-xs md:text-sm md:hover:underline">
              Смотреть все →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {hits.map(p => (
              <ProductCard key={`hit-${p.id}`} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Category: Ossetian */}
      {ossetian.length > 0 && (
        <section>
          <div className="flex flex-row items-end justify-between mb-4 sm:mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-ink font-serif font-bold leading-tight">Осетинские пироги</h2>
            <Link href="/catalog" className="text-accent font-bold text-xs md:text-sm md:hover:underline whitespace-nowrap shrink-0">
              Смотреть все →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {ossetian.map(p => (
              <ProductCard key={`ossetian-${p.id}`} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Category: Meat */}
      {meat.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-ink font-serif font-bold">Мясные пироги</h2>
            <Link href="/catalog" className="text-accent font-bold text-xs md:text-sm md:hover:underline">
              Смотреть все →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {meat.map(p => (
              <ProductCard key={`meat-${p.id}`} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Category: Sweet */}
      {sweet.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-ink font-serif font-bold">Сладкие пироги</h2>
            <Link href="/catalog" className="text-accent font-bold text-xs md:text-sm md:hover:underline">
              Смотреть все →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {sweet.map(p => (
              <ProductCard key={`sweet-${p.id}`} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Promotions Section */}
      <section className="bg-bg-warm p-6 sm:p-8 lg:p-10 py-10 md:py-12 rounded-[28px] md:rounded-3xl mt-4">
        <h2 className="text-2xl md:text-3xl mb-6 md:mb-8 text-ink font-serif font-bold text-center">Акции</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 max-w-[1360px] mx-auto w-full">
          <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border-warm flex flex-row sm:flex-col items-center sm:items-center sm:text-center text-left gap-4 sm:gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent shrink-0">
              <Gift className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-ink mb-0.5 md:mb-1">Самовывоз −10%</h3>
              <p className="text-[11px] md:text-xs text-muted leading-relaxed">Скидка на весь заказ при самовывозе из пекарни</p>
            </div>
          </div>
          <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border-warm flex flex-row sm:flex-col items-center sm:items-center sm:text-center text-left gap-4 sm:gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent shrink-0">
              <Truck className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-ink mb-0.5 md:mb-1">Бесплатная доставка</h3>
              <p className="text-[11px] md:text-xs text-muted leading-relaxed">При заказе на сумму от 5000 ₽ по Москве</p>
            </div>
          </div>
          <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border-warm flex flex-row sm:flex-col items-center sm:items-center sm:text-center text-left gap-4 sm:gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent shrink-0">
              <UtensilsCrossed className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-ink mb-0.5 md:mb-1">Нож в подарок</h3>
              <p className="text-[11px] md:text-xs text-muted leading-relaxed">Фирменный нож при заказе от 7000 ₽</p>
            </div>
          </div>
          <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border-warm flex flex-row sm:flex-col items-center sm:items-center sm:text-center text-left gap-4 sm:gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent shrink-0">
              <PieChart className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-ink mb-0.5 md:mb-1">Пирог в подарок</h3>
              <p className="text-[11px] md:text-xs text-muted leading-relaxed">Сладкий пирог при заказе от 3000 ₽</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

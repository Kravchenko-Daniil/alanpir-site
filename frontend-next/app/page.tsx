import Link from 'next/link';
import Script from 'next/script';
import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Gift, Cake, Apple } from 'lucide-react';
import { MENU, productById } from '@/lib/menu';
import type { Product } from '@/lib/menu';
import { menuJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Осетинские пироги с доставкой по Москве',
  description:
    'Доставка горячих осетинских пирогов по Москве за 40–120 минут. Фыдджын, Цахараджын, Уалибах, сладкие пироги и сеты. Традиционные рецепты, ручная лепка.',
  alternates: { canonical: '/' },
};

export default function Home() {
  const HIT_ORDER = [
    'osetinskii-pirog-s-myasom-fyddzhyn',
    'osetinskiy-pirog-s-kapustoi-kabuskadzhyn',
    'osetinskiy-pirog-s-syrom-ualibah',
    'osetinskiy-pirog-s-kartofelem-i-syrom-kartofdzhyn',
    'osetinskiy-pirog-s-kuritsey-i-syrom',
    'osetinskiy-sladkiy-pirog-s-vishnei-baldzhyn',
    'sladkiy-pirog-s-yablokom',
  ];
  const hits = HIT_ORDER.map((id) => productById(id)).filter(Boolean) as Product[];
  const sets = MENU.filter((p) => p.categorySlug === 'set');

  return (
    <div className="pb-16 pt-4 sm:pt-6 flex flex-col gap-10 md:gap-16">
      <Script
        id="ld-menu"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd(MENU)) }}
      />

      {/* 1. Banner */}
      <section>
        <div className="relative w-full overflow-hidden rounded-3xl">
          <img
            src="/banner-kapusta.jpg"
            alt="Осетинский пирог с капустой"
            className="w-full h-[200px] sm:h-[300px] md:h-[380px] lg:h-[440px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex justify-center p-5 sm:p-7 md:p-9">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-colors shadow-lg"
            >
              Заказать сейчас
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Hero */}
      <section className="flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.15] mb-4 md:mb-6 text-ink font-serif font-bold text-balance">
          Доставка <span className="text-accent underline decoration-accent/30 underline-offset-4">осетинских пирогов</span> по всей Москве
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted max-w-2xl text-balance px-2">
          Традиционные рецепты, ручная лепка, доставка горячими по Москве за 40–120 минут.
        </p>
      </section>

      {/* 3. Хиты — одной лентой */}
      {hits.length > 0 && (
        <section>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-ink font-serif font-bold mb-4 sm:mb-6">Хиты</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {hits.map((p) => (
              <ProductCard key={`hit-${p.id}`} product={p} />
            ))}
          </div>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-full text-sm md:text-base font-bold transition-colors"
            >
              Весь каталог
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* 4. Сеты */}
      {sets.length > 0 && (
        <section>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-ink font-serif font-bold mb-4 sm:mb-6">Сеты</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {sets.map((p) => (
              <ProductCard key={`set-${p.id}`} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Акции */}
      <section className="bg-bg-warm p-6 sm:p-8 lg:p-10 py-10 md:py-12 rounded-[28px] md:rounded-3xl mt-4">
        <h2 className="text-2xl md:text-3xl mb-6 md:mb-8 text-ink font-serif font-bold text-center">Акции</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 max-w-[1360px] mx-auto w-full items-stretch">
          {/* Самовывоз */}
          <div className="bg-surface p-6 md:p-7 rounded-2xl border border-border-warm shadow-sm flex flex-col gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent">
              <Gift className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-ink">Самовывоз −10%</h3>
            <p className="text-xs md:text-sm text-muted leading-relaxed">
              Скидка 10% на весь заказ, если забираете пироги сами из пекарни на Трифоновской.
            </p>
          </div>

          {/* Именинникам — три ступени */}
          <div className="bg-surface p-6 md:p-7 rounded-2xl border border-border-warm shadow-sm flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent shrink-0">
                <Cake className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-ink mb-1">Именинникам — подарок</h3>
                <p className="text-xs md:text-sm text-muted leading-relaxed">
                  За неделю до и неделю после дня рождения дарим пирог к заказу. При получении покажите курьеру паспорт.
                </p>
              </div>
            </div>
            <ul className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <li className="flex-1 bg-bg-warm rounded-xl p-4 flex flex-col gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 text-accent">
                  <Apple className="w-5 h-5" />
                </span>
                <span className="text-sm font-bold text-ink">от 2000 ₽</span>
                <span className="text-[11px] md:text-xs text-muted leading-relaxed">
                  Большой сладкий пирог с яблоком в подарок
                </span>
              </li>
              <li className="flex-1 bg-bg-warm rounded-xl p-4 flex flex-col gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 text-accent">
                  <Gift className="w-5 h-5" />
                </span>
                <span className="text-sm font-bold text-ink">от 3000 ₽</span>
                <span className="text-[11px] md:text-xs text-muted leading-relaxed">
                  Большой пирог с капустой в подарок
                </span>
              </li>
              <li className="flex-1 bg-bg-warm rounded-xl p-4 flex flex-col gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent/10 text-accent">
                  <Cake className="w-5 h-5" />
                </span>
                <span className="text-sm font-bold text-ink">от 6000 ₽</span>
                <span className="text-[11px] md:text-xs text-muted leading-relaxed">
                  Сладкие пироги с яблоком и вишней в подарок
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Flame, Truck, ShieldCheck, Gift, UtensilsCrossed, Sparkles } from 'lucide-react';
import { MENU } from '@/lib/menu';

const HITS = MENU.filter((p) => p.badge === 'hit');
const FEATURED_OSSETIAN = MENU.filter((p) => p.categorySlug === 'ossetian').slice(0, 4);
const FEATURED_MEAT = MENU.filter((p) => p.categorySlug === 'meat').slice(0, 4);
const FEATURED_SWEET = MENU.filter((p) => p.categorySlug === 'sweet').slice(0, 4);

function BannerSlot() {
  // Временная заглушка. Заменится на баннер от клиента.
  return (
    <div className="relative w-full aspect-[16/6] sm:aspect-[16/5] rounded-2xl overflow-hidden bg-accent flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-xs uppercase font-bold text-ink/60 tracking-wider mb-2">Место под баннер</div>
        <div className="text-sm md:text-base text-ink/80">
          Здесь будет главное предложение месяца
        </div>
      </div>
    </div>
  );
}

function Section({ title, products, href }: { title: string; products: typeof MENU; href: string }) {
  if (products.length === 0) return null;
  return (
    <section className="mb-12 md:mb-16">
      <div className="flex items-end justify-between mb-5 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-serif text-ink font-bold">{title}</h2>
        <Link href={href} className="text-sm text-muted hover:text-ink transition-colors">
          Смотреть все →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="pb-12">
      <section className="pt-6 md:pt-8 mb-8 md:mb-10">
        <BannerSlot />
      </section>

      <section className="mb-10 md:mb-14 text-center">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-ink leading-tight mb-2">
          Осетинские пироги АланПир
        </h1>
        <p className="text-sm md:text-base text-muted">
          Традиционные рецепты, ручная лепка, доставка по Москве
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16">
        <div className="bg-bg-warm border border-border-warm rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-ink shrink-0"><Flame className="w-5 h-5" /></div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-ink">Печём под заказ</div>
            <div className="text-xs text-muted">Приезжает горячим</div>
          </div>
        </div>
        <div className="bg-bg-warm border border-border-warm rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-ink shrink-0"><ShieldCheck className="w-5 h-5" /></div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-ink">Натуральные ингредиенты</div>
            <div className="text-xs text-muted">Фермерские мясо и сыр</div>
          </div>
        </div>
        <div className="bg-bg-warm border border-border-warm rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-ink shrink-0"><Truck className="w-5 h-5" /></div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-ink">Быстрая доставка</div>
            <div className="text-xs text-muted">40–120 минут по Москве</div>
          </div>
        </div>
        <div className="bg-bg-warm border border-border-warm rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-ink shrink-0"><Sparkles className="w-5 h-5" /></div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-ink">Рейтинг 5.0★</div>
            <div className="text-xs text-muted">На Яндекс Картах</div>
          </div>
        </div>
      </section>

      {HITS.length > 0 && <Section title="Хиты" products={HITS} href="/catalog" />}
      <Section title="Осетинские пироги" products={FEATURED_OSSETIAN} href="/catalog" />
      <Section title="Мясные пироги" products={FEATURED_MEAT} href="/catalog" />
      <Section title="Сладкие пироги" products={FEATURED_SWEET} href="/catalog" />

      <section>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-ink mb-5">Текущие акции</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Gift, title: 'Самовывоз −10%', text: 'Скидка на весь заказ при самовывозе' },
            { icon: Truck, title: 'Бесплатная доставка', text: 'При заказе от 5000 ₽' },
            { icon: UtensilsCrossed, title: 'Нож в подарок', text: 'Фирменный нож при заказе от 7000 ₽' },
            { icon: Sparkles, title: 'Пирог в подарок', text: 'Сладкий пирог при заказе от 3000 ₽' },
          ].map((p, i) => (
            <div key={i} className="bg-bg-warm border border-border-warm p-5 rounded-2xl flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-ink">
                <p.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink mb-1">{p.title}</h3>
                <p className="text-xs text-muted">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Check, Star, Flame } from 'lucide-react';

export default function Home() {
  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="py-10 md:py-16 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-[52px] leading-[1.1] mb-6 text-ink">
            Горячие осетинские пироги по Москве <span className="text-terracotta italic">от 20 минут</span>
          </h1>
          <p className="text-lg text-muted mb-8 max-w-[400px]">
            Традиционные рецепты, натуральные ингредиенты и ручная лепка. Доставляем тепло в каждый дом.
          </p>
          <Link 
            href="/catalog" 
            className="inline-block bg-terracotta text-white px-9 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-opacity"
          >
            Смотреть меню
          </Link>
        </div>
        <div className="w-full h-[320px] bg-[#EFECE7] rounded-3xl relative overflow-hidden flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(circle at center, #FAF9F6 0%, #EFECE7 100%)' }}>
          <div className="absolute bottom-5 left-5 bg-surface px-4 py-2 rounded-full text-xs font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-ink z-10">
            Фыдджын — легенда гор
          </div>
          <div className="text-[120px] opacity-20">🥧</div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
        <div className="bg-surface p-5 rounded-2xl border border-border-warm flex items-center gap-4">
          <div className="w-10 h-10 bg-bg-warm rounded-full flex items-center justify-center text-terracotta">
            <Check className="w-5 h-5" strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink mb-0.5 font-sans">Фермерское мясо</h3>
            <p className="text-xs text-muted">Только свежие ингредиенты</p>
          </div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-border-warm flex items-center gap-4">
          <div className="w-10 h-10 bg-bg-warm rounded-full flex items-center justify-center text-terracotta">
            <Star className="w-5 h-5" strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink mb-0.5 font-sans">Рейтинг 5.0</h3>
            <p className="text-xs text-muted">На Яндекс Картах</p>
          </div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-border-warm flex items-center gap-4">
          <div className="w-10 h-10 bg-bg-warm rounded-full flex items-center justify-center text-terracotta">
            <Flame className="w-5 h-5" strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink mb-0.5 font-sans">Печем под заказ</h3>
            <p className="text-xs text-muted">Приезжает горячим</p>
          </div>
        </div>
      </section>

      {/* Hits Section */}
      <section>
        <h2 className="text-3xl mb-6 text-ink">Популярно сейчас</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <ProductCard 
            title="Фыдджын (мясной)"
            weight="1000 г • Тонкое тесто"
            price={1290}
            imageEmoji="🥩"
            badge={{ text: 'Хит', type: 'hit' }}
          />
          <ProductCard 
            title="Цахараджын"
            weight="1000 г • Сыр и листья свеклы"
            price={1120}
            imageEmoji="🍃"
          />
          <ProductCard 
            title="Пирог с сёмгой"
            weight="700 г • Шпинат и рыба"
            price={1740}
            imageEmoji="🐟"
            badge={{ text: 'Новинка', type: 'new' }}
          />
        </div>
      </section>
    </div>
  );
}

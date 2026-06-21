import type { Metadata } from 'next';
import { CheckCircle2, ChefHat, Eye, Flame, Heart, MapPin, Users, Wheat } from 'lucide-react';

export const metadata: Metadata = {
  title: 'О пекарне',
  description:
    'Пекарня АланПир — осетинские пироги ручной лепки из натуральных ингредиентов. Фермерское мясо, осетинский сыр, отборная мука. Печём под заказ.',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  return (
    <div className="py-10">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl mb-6 text-ink">О пекарне АланПир</h1>
        <div className="text-lg text-muted space-y-4 mb-12">
          <p>
            <strong className="text-ink">АланПир</strong> — кафе-пекарня осетинских пирогов в центре Москвы. Мы готовим настоящие осетинские пироги по традиционным рецептам — с тонким тестом, большим количеством начинки, и выпекаем каждый пирог только после заказа.
          </p>
          <p>
            Главное для нас — чтобы гости видели, как готовится их еда. Поэтому в АланПир открытая кухня: вы можете наблюдать весь процесс — от раскатки теста до горячего пирога из печи.
          </p>
          <p>
            В нашей пекарне работают повара из Осетии, которые знают традиции приготовления настоящих осетинских пирогов и сохраняют тот самый вкус, за который их любят уже много лет.
          </p>
          <p>
            Мы не работаем как безликая фабрика доставки. У нас есть настоящее кафе, куда можно прийти, попробовать пироги прямо из печи или заказать доставку горячих пирогов по Москве.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6 mb-12">
        <div className="bg-surface p-3 md:p-4 rounded-xl sm:rounded-2xl border border-border-warm flex flex-col items-center text-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-bg-warm rounded-full flex items-center justify-center text-accent shrink-0">
            <ChefHat className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
          </div>
          <span className="text-[11px] sm:text-xs md:text-sm font-bold text-ink leading-tight text-balance">Печём под заказ</span>
        </div>
        <div className="bg-surface p-3 md:p-4 rounded-xl sm:rounded-2xl border border-border-warm flex flex-col items-center text-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-bg-warm rounded-full flex items-center justify-center text-accent shrink-0">
            <Flame className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
          </div>
          <span className="text-[11px] sm:text-xs md:text-sm font-bold text-ink leading-tight text-balance">Доставляем горячими</span>
        </div>
        <div className="bg-surface p-3 md:p-4 rounded-xl sm:rounded-2xl border border-border-warm flex flex-col items-center text-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-bg-warm rounded-full flex items-center justify-center text-accent shrink-0">
            <MapPin className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
          </div>
          <span className="text-[11px] sm:text-xs md:text-sm font-bold text-ink leading-tight text-balance">Работаем в центре Москвы</span>
        </div>
        <div className="bg-surface p-3 md:p-4 rounded-xl sm:rounded-2xl border border-border-warm flex flex-col items-center text-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-bg-warm rounded-full flex items-center justify-center text-accent shrink-0">
            <Users className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
          </div>
          <span className="text-[11px] sm:text-xs md:text-sm font-bold text-ink leading-tight text-balance">Повара из Осетии</span>
        </div>
        <div className="bg-surface p-3 md:p-4 rounded-xl sm:rounded-2xl border border-border-warm flex flex-col items-center text-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-bg-warm rounded-full flex items-center justify-center text-accent shrink-0">
            <Eye className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
          </div>
          <span className="text-[11px] sm:text-xs md:text-sm font-bold text-ink leading-tight text-balance">Открытая кухня</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        <div className="bg-[#F2F2F7] p-6 rounded-2xl flex flex-col gap-4">
          <div className="text-terracotta">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-ink font-sans">Лучшее мясо</h3>
          <p className="text-sm text-muted">Используем только свежее фермерское мясо для максимально сочной и ароматной начинки.</p>
        </div>
        <div className="bg-[#F2F2F7] p-6 rounded-2xl flex flex-col gap-4">
          <div className="text-terracotta">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-ink font-sans">Натуральные сыры</h3>
          <p className="text-sm text-muted">Настоящий осетинский сыр, который идеально плавится и тянется в горячем пироге.</p>
        </div>
        <div className="bg-[#F2F2F7] p-6 rounded-2xl flex flex-col gap-4">
          <div className="text-terracotta">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-ink font-sans">Наши пекари</h3>
          <p className="text-sm text-muted">Мастера своего дела. Ручная лепка и выпекание строго перед отправкой курьера.</p>
        </div>
        <div className="bg-[#F2F2F7] p-6 rounded-2xl flex flex-col gap-4">
          <div className="text-terracotta">
            <Wheat className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-ink font-sans">Отборная мука</h3>
          <p className="text-sm text-muted">Специальный сорт муки позволяет нам делать тесто невероятно тонким, оставляя максимум места для начинки.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="h-48 bg-[#EFECE7] rounded-2xl relative overflow-hidden flex items-center justify-center text-4xl">👨‍🍳</div>
        <div className="h-48 bg-[#EFECE7] rounded-2xl relative overflow-hidden flex items-center justify-center text-4xl">🔥</div>
        <div className="h-48 bg-[#EFECE7] rounded-2xl relative overflow-hidden flex items-center justify-center text-4xl col-span-2 md:col-span-1">🛵</div>
      </div>
    </div>
  );
}

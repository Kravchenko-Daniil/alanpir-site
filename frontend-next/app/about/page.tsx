import Image from 'next/image';
import type { Metadata } from 'next';
import { CheckCircle2, Heart, Users, Wheat } from 'lucide-react';

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
            Мы готовим настоящие осетинские пироги по традиционным рецептам, которые передаются в нашей семье из поколения в поколение. Наша главная цель — доставить вам не просто еду, а частичку кавказского тепла и гостеприимства.
          </p>
          <p>
            Каждый пирог лепится вручную только после вашего заказа. Мы не используем замороженные полуфабрикаты и искусственные добавки.
          </p>
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

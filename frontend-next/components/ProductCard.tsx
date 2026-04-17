'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useProductModal } from '@/hooks/useProductModal';
import { minPrice, type Product } from '@/lib/menu';

interface ProductCardProps {
  product: Product;
}

const BADGE_LABEL: Record<NonNullable<Product['badge']>, string> = {
  hit: 'Хит',
  new: 'Новинка',
};

export default function ProductCard({ product }: ProductCardProps) {
  const { openModal } = useProductModal();
  const price = product.weights.length > 0 ? minPrice(product) : 0;
  const shortComposition = product.composition?.split(',')[0]?.trim() || '';
  const firstWeight = product.weights[0]?.weight;

  return (
    <div
      onClick={() => openModal(product)}
      className="bg-white rounded-2xl border border-border-warm p-3 md:p-4 relative hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
    >
      {product.badge && (
        <div
          className={`absolute top-5 left-5 z-10 text-[10px] px-2 py-1 rounded-full uppercase font-bold ${
            product.badge === 'hit' ? 'bg-ink text-white' : 'bg-accent text-ink'
          }`}
        >
          {BADGE_LABEL[product.badge]}
        </div>
      )}

      <div className="w-full aspect-square bg-bg-warm rounded-xl mb-3 md:mb-4 relative overflow-hidden flex items-center justify-center text-5xl md:text-6xl">
        {product.image ? (
          <Image src={product.image} alt={product.title} fill className="object-cover" />
        ) : (
          <span>{product.emoji}</span>
        )}
      </div>

      <h4 className="font-sans text-sm md:text-base font-semibold text-ink mb-1 line-clamp-2 leading-tight">
        {product.title}
      </h4>
      <p className="text-xs text-muted mb-3 flex-1 line-clamp-1">
        {firstWeight && `${firstWeight}`}{firstWeight && shortComposition && ' • '}{shortComposition}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="text-base md:text-lg font-bold text-ink">
          {price > 0 ? `от ${price.toLocaleString('ru-RU')} ₽` : 'По запросу'}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openModal(product);
          }}
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-ink text-white flex items-center justify-center hover:bg-action-hover transition-colors shrink-0"
          aria-label="Добавить в корзину"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

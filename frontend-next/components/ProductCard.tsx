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
  const firstWeight = product.weights[0]?.weight;
  const weightLine = firstWeight
    ? `${firstWeight}${product.composition ? ` • ${product.composition.split(',')[0].trim()}` : ''}`
    : product.composition.split(',')[0]?.trim() || product.category;

  return (
    <div
      onClick={() => openModal(product)}
      className="bg-surface rounded-2xl border border-border-warm p-4 relative group hover:shadow-md transition-shadow duration-300 flex flex-col h-full cursor-pointer"
    >
      {product.badge && (
        <div
          className={`absolute top-6 left-6 z-10 text-[10px] px-2 py-1 rounded uppercase font-bold text-white ${
            product.badge === 'hit' ? 'bg-ink' : 'bg-terracotta'
          }`}
        >
          {BADGE_LABEL[product.badge]}
        </div>
      )}

      <div className="w-full h-[140px] bg-[#F5F5F5] rounded-xl mb-4 relative overflow-hidden flex items-center justify-center text-6xl">
        {product.image ? (
          <Image src={product.image} alt={product.title} fill className="object-cover" />
        ) : (
          <span>{product.emoji}</span>
        )}
      </div>

      <h4 className="font-sans text-lg font-semibold text-ink mb-1 line-clamp-2">{product.title}</h4>
      <p className="text-xs text-muted mb-4 flex-1 line-clamp-2">{weightLine}</p>

      <div className="flex items-center justify-between mt-auto">
        <div className="text-xl font-bold text-ink">
          {price > 0 ? `от ${price.toLocaleString('ru-RU')} ₽` : 'По запросу'}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openModal(product);
          }}
          className="w-10 h-10 rounded-full border border-terracotta text-terracotta flex items-center justify-center hover:bg-terracotta hover:text-white transition-colors"
          aria-label="Добавить в корзину"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

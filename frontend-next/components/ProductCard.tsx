'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useProductModal } from '@/hooks/useProductModal';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { defaultWeightIdx, formatWeight, type Product } from '@/lib/menu';

interface ProductCardProps {
  product: Product;
}

const BADGE_LABEL: Record<NonNullable<Product['badge']>, string> = {
  hit: 'Хит',
  new: 'Новинка',
};

export default function ProductCard({ product }: ProductCardProps) {
  const { openModal } = useProductModal();
  const { addItem } = useCart();
  const { show } = useToast();
  const [weightIdx, setWeightIdx] = useState(() => defaultWeightIdx(product));
  const hasWeights = product.weights.length > 0;
  const current = hasWeights ? product.weights[weightIdx] : null;
  const price = current?.price ?? 0;

  const handleAdd = () => {
    if (!hasWeights) {
      openModal(product);
      return;
    }
    addItem(product, weightIdx, 1);
    show(`Добавлено: ${product.title}`, 'success');
  };

  return (
    <div className="bg-surface rounded-2xl border border-border-warm p-4 relative group hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {product.badge && (
        <div
          className={`absolute top-6 left-6 z-10 text-[10px] px-2 py-1 rounded uppercase font-bold text-white ${
            product.badge === 'hit' ? 'bg-ink' : 'bg-terracotta'
          }`}
        >
          {BADGE_LABEL[product.badge]}
        </div>
      )}

      <button
        type="button"
        onClick={() => openModal(product)}
        aria-label={`Подробнее: ${product.title}`}
        className="w-full h-[140px] bg-[#F5F5F5] rounded-xl mb-4 relative overflow-hidden flex items-center justify-center cursor-pointer"
      >
        <Image
          src={product.image ?? '/menu/_placeholder.svg'}
          alt={product.title}
          fill
          className="object-contain p-2"
        />
      </button>

      <h4 className="font-sans text-lg font-semibold text-ink mb-3">{product.title}</h4>

      {hasWeights && product.weights.length > 1 && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {product.weights.map((w, i) => (
            <button
              key={w.weight}
              type="button"
              onClick={() => setWeightIdx(i)}
              className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                weightIdx === i
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'bg-surface text-ink border-border-warm hover:border-terracotta'
              }`}
              aria-pressed={weightIdx === i}
            >
              {formatWeight(w.weight)}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto">
        <div className="text-xl font-bold text-ink">
          {price > 0 ? `${price.toLocaleString('ru-RU')} ₽` : 'По запросу'}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="w-10 h-10 rounded-full border border-terracotta text-terracotta flex items-center justify-center hover:bg-terracotta hover:text-white transition-colors"
          aria-label={hasWeights ? 'Добавить в корзину' : 'Подробнее'}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

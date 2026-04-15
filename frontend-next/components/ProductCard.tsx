'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useProductModal } from '@/hooks/useProductModal';

interface ProductCardProps {
  title: string;
  weight: string;
  price: number;
  imageEmoji?: string;
  imageUrl?: string;
  badge?: {
    text: string;
    type: 'hit' | 'new';
  };
}

export default function ProductCard(props: ProductCardProps) {
  const { openModal } = useProductModal();
  const { title, weight, price, imageEmoji, imageUrl, badge } = props;

  return (
    <div 
      onClick={() => openModal({ id: title, ...props })}
      className="bg-surface rounded-2xl border border-border-warm p-4 relative group hover:shadow-md transition-shadow duration-300 flex flex-col h-full cursor-pointer"
    >
      {badge && (
        <div 
          className={`absolute top-6 left-6 z-10 text-[10px] px-2 py-1 rounded uppercase font-bold text-white ${
            badge.type === 'hit' ? 'bg-ink' : 'bg-terracotta'
          }`}
        >
          {badge.text}
        </div>
      )}
      
      <div className="w-full h-[140px] bg-[#F5F5F5] rounded-xl mb-4 relative overflow-hidden flex items-center justify-center text-6xl">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span>{imageEmoji}</span>
        )}
      </div>
      
      <h4 className="font-sans text-lg font-semibold text-ink mb-1">{title}</h4>
      <p className="text-xs text-muted mb-4 flex-1">{weight}</p>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="text-xl font-bold text-ink">{price.toLocaleString('ru-RU')} ₽</div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            openModal({ id: title, ...props });
          }}
          className="w-10 h-10 rounded-full border border-terracotta text-terracotta flex items-center justify-center hover:bg-terracotta hover:text-white transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

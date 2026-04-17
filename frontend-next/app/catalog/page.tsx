'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { MENU, CATEGORIES, type CategorySlug } from '@/lib/menu';

export default function CatalogPage() {
  const [active, setActive] = useState<CategorySlug>('all');
  const [leanOnly, setLeanOnly] = useState(false);

  const products = useMemo(() => {
    let list = active === 'all' ? MENU : MENU.filter((p) => p.categorySlug === active);
    if (leanOnly) list = list.filter((p) => p.isLean);
    return list;
  }, [active, leanOnly]);

  return (
    <div className="py-10">
      <h1 className="text-4xl md:text-5xl mb-8 text-ink font-serif">
        Все пироги <span className="text-terracotta italic">и сеты</span>
      </h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-20 bg-bg-warm/95 backdrop-blur py-4 z-40">
        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active === c.slug
                  ? 'bg-ink text-white'
                  : 'bg-[#F2F2F7] text-ink hover:bg-border-warm'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-ink">
            <div className="relative">
              <input
                type="checkbox"
                checked={leanOnly}
                onChange={(e) => setLeanOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-border-warm rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terracotta"></div>
            </div>
            Только постные
          </label>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center text-muted">
          В этой категории пока нет позиций
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
